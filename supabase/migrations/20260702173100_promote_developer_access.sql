-- Promote the product owner and add platform-level organization policies.
-- Run after the role type/check constraint accepts `developer`.

update public.profiles
set role = 'developer'
where lower(full_name) = lower('Gabriel Neves');

drop policy if exists "Developers can read all organizations" on public.organizations;
create policy "Developers can read all organizations"
on public.organizations
for select
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'developer'
  )
);

drop policy if exists "Developers can update all organizations" on public.organizations;
create policy "Developers can update all organizations"
on public.organizations
for update
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'developer'
  )
)
with check (true);
