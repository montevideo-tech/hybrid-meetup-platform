create policy "Enable insert for authenticated users only"
on "public"."rooms"
as permissive
for insert
to public
with check (true);



