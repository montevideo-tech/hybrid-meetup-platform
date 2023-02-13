import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts';
import Mux from "https://esm.sh/v106/@mux/mux-node@7.0.0/es2022/mux-node.js";

async function generateToken(spaceId: string) {
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
    const body = await req.json();
    const spaceId = body.spaceId;
    return generateToken(spaceId)
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})