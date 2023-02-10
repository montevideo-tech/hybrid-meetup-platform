import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
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

serve(async (req) => {
  const { url, method } = req

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    return createSpace();
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})