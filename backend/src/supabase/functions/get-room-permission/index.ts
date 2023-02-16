import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

async function getPermission(supabaseClient, body) {
  let { userId, roomId }= body;
  roomId = parseInt(roomId);
  const roomsData = await supabaseClient.from('rooms-data').select('permissionId').match({ roomId,  userId });
  if (roomsData.data && roomsData.data.length === 0) {
    return new Response(JSON.stringify({
      error: 'No room or user with given data exists'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 404
    });
  }

  const permissionId = parseInt(roomsData.data[0].permissionId);
  const permission = await supabaseClient.from('rooms-permission').select('name').match({ id: permissionId });

  return new Response(JSON.stringify({
    permission: permission.data[0].name,
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