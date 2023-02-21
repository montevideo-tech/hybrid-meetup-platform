import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

async function createSpace() {
  const accessTokenID = Deno.env.get('ACCESS_TOKEN_ID');
  const secretKey = Deno.env.get('SECRET_KEY');
  const muxCredentials = btoa(`${accessTokenID}:${secretKey}`);
  const key = `Basic ${muxCredentials}`;

  const response = await fetch('https://api.mux.com/video/v1/spaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: key
      },
      body: JSON.stringify({})
    });

    const {data, errors} = await response.json();

    if(data)
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    return new Response(JSON.stringify({ errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
}

async function deleteSpace(supabaseClient, body) {
  let { providerId } = body;
  console.error("hola");
  const roomData = await supabaseClient.from('rooms').select('providerId').eq('providerId', providerId);
  if (!roomData.data || (roomData.data?.length === 0))
    return returnError("No room with given data exists");

  const accessTokenID = Deno.env.get('ACCESS_TOKEN_ID');
  const secretKey = Deno.env.get('SECRET_KEY');
  const muxCredentials = btoa(`${accessTokenID}:${secretKey}`);
  const key = `Basic ${muxCredentials}`;

  const response = await fetch(`https://api.mux.com/video/v1/spaces/${providerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: key
      },
    });
  
  if(response.status < 300 && response.status > 199){
    await supabaseClient.from('rooms-data').delete().match({ providerId });
    await supabaseClient.from('rooms').delete().match({ providerId });
    return new Response(JSON.stringify({ status: "OK" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  return new Response(JSON.stringify({ errors: response.statusText }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 400,
  });
}

serve(async (req) => {
  const { url, method } = req;
  console.error("entra");
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      return createSpace();
    }

    if (req.method === 'DELETE') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      const body = await req.json();
      return deleteSpace(supabaseClient, body);
    }
  } catch (error) {
    console.error("error");
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
