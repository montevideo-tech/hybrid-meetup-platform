alter table "public"."roles" drop column "role-name";

alter table "public"."roles" add column "roleName" text;

alter table "public"."users-data" drop column "role_id";

alter table "public"."users-data" drop column "user_id";

alter table "public"."users-data" add column "roleId" smallint not null default '1'::smallint;

alter table "public"."users-data" add column "userId" uuid;


