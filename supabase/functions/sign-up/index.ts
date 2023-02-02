import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

interface User {
  email: String
  password: String
}

async function singUp(supabaseClient: SupabaseClient, user: User) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: user.email,
        password: user.password,
    })

    await supabaseClient.from('user-data').insert({ 
      email: user.email,
      username: user.username
    })
    
    if(error){
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
}

serve(async (req) => {
  const { url, method } = req

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseClient = createClient(supabaseUrl, supabaseKey)
    
    const body = await req.json();
    const user = body.user;
    return singUp(supabaseClient, user)

  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
