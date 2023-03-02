import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

async function returnError(msgError: string) {
  return new Response(JSON.stringify({
    error: msgError
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    },
    status: 400
  });
}

async function givePermission(supabaseClient, body) {
  let { userEmail, providerId, permission } = body;

  const roomData = await supabaseClient.from('rooms').select('providerId').eq('providerId', providerId);
  if (!roomData.data || (roomData.data?.length === 0))
    return returnError("No room with given data exists");

  const user = await supabaseClient.from('users-data').select('userId').eq('email', userEmail);
  if (!user.data || (user.data?.length === 0))
    return returnError("No user with given data exists");

  permission = permission?.toUpperCase();
  const permissionData = await supabaseClient.from('rooms-permission').select('id').eq('name', permission);
  if (!permissionData.data || (permissionData.data?.length === 0))
    return returnError("No permission with given data exists");

  const permissionId = permissionData.data[0].id;
  await supabaseClient.from('rooms-data').delete().match({ providerId, userEmail });

  const insert = await supabaseClient.from('rooms-data').insert({
    providerId,
    userEmail,
    permissionId,
  });

  return new Response(JSON.stringify({
    permission: permission,
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    },
    status: 200
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    return givePermission(supabaseClient, body);
  } catch (error) {
    return new Response(JSON.stringify({
      error,
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500,
    });
  }
});