for folders in */ ; do
    supabase functions deploy $(basename ${folders})
done