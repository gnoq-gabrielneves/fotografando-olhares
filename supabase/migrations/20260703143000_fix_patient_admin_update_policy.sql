-- Normalize patient RLS after the organization/licensing work.
-- Admins should be able to manage patients inside their organization, while
-- developers keep platform-level access through current_user_can_access_organization.

alter table public.pacientes enable row level security;

drop policy if exists "Users can read patients from accessible organizations"
on public.pacientes;
create policy "Users can read patients from accessible organizations"
on public.pacientes
for select
using (public.current_user_can_access_organization(organization_id));

drop policy if exists "Users can insert patients in accessible organizations"
on public.pacientes;
create policy "Users can insert patients in accessible organizations"
on public.pacientes
for insert
with check (public.current_user_can_access_organization(organization_id));

drop policy if exists "Admins can update patients in accessible organizations"
on public.pacientes;
create policy "Admins can update patients in accessible organizations"
on public.pacientes
for update
using (
  public.current_user_can_access_organization(organization_id)
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'developer')
  )
)
with check (
  public.current_user_can_access_organization(organization_id)
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'developer')
  )
);

drop policy if exists "Extensionists can update their own patients"
on public.pacientes;
create policy "Extensionists can update their own patients"
on public.pacientes
for update
using (
  public.current_user_can_access_organization(organization_id)
  and extensionista_id = auth.uid()
)
with check (
  public.current_user_can_access_organization(organization_id)
  and extensionista_id = auth.uid()
);

drop policy if exists "Admins can delete patients in accessible organizations"
on public.pacientes;
create policy "Admins can delete patients in accessible organizations"
on public.pacientes
for delete
using (
  public.current_user_can_access_organization(organization_id)
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'developer')
  )
);
