alter table "public"."users-data" drop constraint "users-data_pkey";

drop index if exists "public"."users-data_pkey";

alter table "public"."users-data" drop column "user-id";

alter table "public"."users-data" add column "email" text not null default ''::text;

alter table "public"."users-data" add column "role_id" smallint not null default '1'::smallint;

alter table "public"."users-data" add column "user_id" bigint generated by default as identity not null;

CREATE UNIQUE INDEX "users-data_email_key" ON public."users-data" USING btree (email);

CREATE UNIQUE INDEX "users-data_pkey" ON public."users-data" USING btree (email);

alter table "public"."users-data" add constraint "users-data_pkey" PRIMARY KEY using index "users-data_pkey";

alter table "public"."users-data" add constraint "users-data_email_key" UNIQUE using index "users-data_email_key";

create policy "Enable read access for all users"
on "public"."users-data"
as permissive
for all
to public
using (true)
with check (true);


