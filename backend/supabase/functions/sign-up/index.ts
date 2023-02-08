import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

interface User {
  email: String
  password: String
  username: String
  // userId: number
  // role: number
}

async function signUp(supabaseClient: SupabaseClient, user: User) {
  const emailExists = await supabaseClient.from('users-data').select('email').eq('email', user.email)

  if (emailExists.data && emailExists.data.length !== 0) {
    return new Response(JSON.stringify({
      error: 'User already exists'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
  else {
    const { data, error } = await supabaseClient.auth.signUp({
      email: user.email,
      password: user.password,
    })

    if (error) {
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // if (user.role == 'host'){
    //   roleId = 2
    // }

    await supabaseClient.from('users-data').insert({
      email: user.email,
      username: user.username
      // userId: data.user.id,
      // roleId: roleId
    })

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }

}

serve(async (req) => {
  const { url, method } = req

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    const body = await req.json();
    const user = body.user;
    return signUp(supabaseClient, user)

  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
