import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import Mux from "https://esm.sh/v106/@mux/mux-node@7.0.0/es2022/mux-node.js";

async function generateToken(supabaseClient: SupabaseClient, spaceId: string) {
  const spacesId = await supabaseClient.from('rooms').select('providerId').eq('providerId', spaceId);

  if(spacesId.data && spacesId.data.length === 0){
    return new Response(JSON.stringify({ error: 'Wrong Space ID'}), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
  }

  let baseOptions = {
    keyId: Deno.env.get('SPACE_KEY_ID'),
    keySecret: Deno.env.get('SPACE_PRIVATE_KEY'),
  };

  const spaceToken = Mux.JWT.signSpaceId(spaceId, { ...baseOptions })
  return new Response(JSON.stringify({ spaceToken }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}
serve(async (req) => {
  const { url, method } = req
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const spaceId = body.spaceId;
    return generateToken(supabaseClient, spaceId)
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})