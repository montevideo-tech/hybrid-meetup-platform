import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import * as djwt from "https://deno.land/x/djwt@v2.2/mod.ts";

async function generateToken(supabaseClient, spaceId, participantId) {
  const spacesId = await supabaseClient.from('rooms').select('providerId').eq('providerId', spaceId);
  
  if (spacesId.data && spacesId.data.length === 0) {
    return new Response(JSON.stringify({
      error: 'No room with given providerId exists'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 404
    });
  }
  
  const expiration = new Date().valueOf() + 60*60;
  const spaceToken = await djwt.create({ alg: "RS256", typ: "JWT" }, {
    kid: Deno.env.get('SPACE_KEY_ID') ?? "",
    aud: "rt",
    sub: spaceId,
    exp: expiration,
    participant_id: participantId
  }, atob(Deno.env.get('SPACE_PRIVATE_KEY')))

  return new Response(JSON.stringify({
    spaceToken,
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
    const spaceId = body.spaceId;
    const participantId = body.participantId;
    if (!spaceId || !participantId) {
      return new Response(JSON.stringify(`The must contain a valid ${!spaceId && 'spaceId '}${!participantId && 'participantId '} item`), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      });
    }
    return generateToken(supabaseClient, spaceId, participantId);
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