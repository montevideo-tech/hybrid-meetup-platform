for folders in */ ; do
    supabase functions deploy $(basename ${folders}) --project-ref ukhzedmikizlkmnzgckl
done