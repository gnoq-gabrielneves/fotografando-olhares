-- Platform-level access for product owners/developers.
--
-- Organization admins manage one institution. Developers can operate across
-- organizations and move users between organizations.

do $$
declare
  role_type regtype;
begin
  select (format('%I.%I', n.nspname, t.typname))::regtype
  into role_type
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_type t on t.oid = a.atttypid
  join pg_namespace n on n.oid = t.typnamespace
  where c.oid = 'public.profiles'::regclass
    and a.attname = 'role'
    and t.typtype = 'e';

  if role_type is not null then
    execute format('alter type %s add value if not exists %L', role_type, 'developer');
  end if;
end $$;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.profiles drop constraint if exists %I', constraint_name);
  end loop;
end $$;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('developer', 'admin', 'extensionista', 'laudador'));
