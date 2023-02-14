for folders in ./functions/*/ ; do
    supabase functions deploy $(basename ${folders}) --project-ref ukhzedmikizlkmnzgckl
done