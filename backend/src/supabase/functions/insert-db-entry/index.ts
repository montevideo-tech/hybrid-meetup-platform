import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// TODO expand this function to include adding to the following tables:
// - roles
// - users-data
// - any other new table to be added in the future

interface RoomsEntry {
  createdAt: string
  providerId: string
  name: string
  creatorId: number
}

function insertEntry(supabaseClient: SupabaseClient, table: string, payload: any) {
  switch (table) {
    case 'rooms':
      return insertRoomsEntry(supabaseClient, payload);
    case 'roles':
      // TODO
      return new Response(JSON.stringify({
        error: 'Not yet supported'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    case 'users-data':
      // TODO
      return new Response(JSON.stringify({
        error: 'Not yet supported'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    default:
      return new Response(JSON.stringify({
        error: 'Unknown table'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
  }
}

async function insertRoomsEntry(supabaseClient: SupabaseClient, entry: RoomsEntry) {
  const { name, providerId, creatorId } = entry;
  if (!name || !providerId) {
    return new Response(JSON.stringify(new Error('Missing room name or ID')), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  const { data, error } = await supabaseClient
    .from('rooms')
    .insert({
      // createdAt: entry.createdAt, // provided by supabase on creation
      providerId: providerId,
      name: name,
      creatorId: creatorId,
    })
    .select();

  if (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
    );

    const body = await req.json();
    const { table, ...payload } = body;
    return insertEntry(supabaseClient, table, payload);
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
