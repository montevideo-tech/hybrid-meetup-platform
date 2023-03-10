import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface User {
  email: string
  password: string
}

async function signIn(supabaseClient: SupabaseClient, user: User) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  const userData = await supabaseClient.from('users-data').select('roleId').eq('email', user.email);
  const roleId = parseInt(userData.data[0].roleId);
  const role = await supabaseClient.from('roles').select('roleName').eq('id', roleId);
  data.role = role.data[0].roleName;

  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

serve(async (req) => {
  const { url, method } = req;

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { user } = body;
    return signIn(supabaseClient, user);
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
