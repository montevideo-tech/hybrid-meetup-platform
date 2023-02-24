import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

async function returnError(msgError: string){
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

async function getPermission(supabaseClient, body) {
  let { userEmail, providerId } = body;

  const roomData = await supabaseClient.from('rooms').select('providerId').eq('providerId', providerId);
  if (!roomData.data || (roomData.data?.length === 0))
    return returnError("No room with given data exists");

  const users = await supabaseClient.from('users-data').select('email').eq('email', userEmail);
  if (!users.data || (users.data?.length === 0))
    return returnError("No user with given data exists");

  const roomsData = await supabaseClient.from('rooms-data').select('permissionId').match({ providerId, userEmail });

  let permission = "GUEST"
  if (roomsData.data?.length !== 0){
    const permissionId = parseInt(roomsData.data[0].permissionId);
    permission = await supabaseClient.from('rooms-permission').select('name').eq( 'id', permissionId );
    permission = permission.data[0].name;
  }

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

serve(async (req)=>{
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

    return getPermission(supabaseClient, body);
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