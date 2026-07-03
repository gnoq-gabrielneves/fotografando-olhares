-- Allow platform developers to operate clinical documents across organizations.
-- Regular users stay scoped to their own organization.

create or replace function public.current_user_is_developer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'developer'
  )
$$;

create or replace function public.current_user_can_access_organization(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    target_organization_id = public.current_user_organization_id()
    or public.current_user_is_developer()
$$;

drop policy if exists "Users can read clinical documents from their organization"
on public.clinical_documents;
create policy "Users can read clinical documents from their organization"
on public.clinical_documents
for select
using (public.current_user_can_access_organization(organization_id));

drop policy if exists "Users can insert clinical documents in their organization"
on public.clinical_documents;
create policy "Users can insert clinical documents in their organization"
on public.clinical_documents
for insert
with check (public.current_user_can_access_organization(organization_id));

drop policy if exists "Users can update clinical documents from their organization"
on public.clinical_documents;
create policy "Users can update clinical documents from their organization"
on public.clinical_documents
for update
using (public.current_user_can_access_organization(organization_id))
with check (public.current_user_can_access_organization(organization_id));
