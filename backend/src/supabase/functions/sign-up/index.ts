import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

async function signUp(supabaseClient: any, user: any) {
  const emailExists = await supabaseClient.from('users-data').select('email').eq('email', user.email);
  if (emailExists.data && emailExists.data.length !== 0) {
    return new Response(JSON.stringify({ error: 'User already exists' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  } else {
    const { data, error } = await supabaseClient.auth.signUp({
      email: user.email,
      password: user.password
    });
    if (error) {
      return new Response(JSON.stringify({
        error
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    // if (user.role == 'host'){
    //   roleId = 2
    // }

    await supabaseClient.from('users-data').insert({
      email: user.email,
      username: user.username,
      userId: data.user.id
    });

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
}
serve(async (req) => {
  const { url, method } = req;
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const user = body.user;

    return signUp(supabaseClient, user);
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
