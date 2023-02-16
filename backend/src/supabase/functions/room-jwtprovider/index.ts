import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import Mux from "https://esm.sh/v106/@mux/mux-node@7.0.0/es2022/mux-node.js";
async function generateToken(supabaseClient, spaceId) {
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
  let baseOptions = {
    keyId: Deno.env.get('SPACE_KEY_ID'),
    keySecret: Deno.env.get('SPACE_PRIVATE_KEY'),
  };
  const spaceToken = Mux.JWT.signSpaceId(spaceId, {
    ...baseOptions,
  });
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
    if (!spaceId) {
      return new Response(JSON.stringify('The must contain a valid spaceId item'), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      });
    }
    return generateToken(supabaseClient, spaceId);
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
