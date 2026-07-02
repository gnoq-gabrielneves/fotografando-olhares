-- Multi-institution foundation for Fotografando Olhares.
--
-- This migration keeps the current single-institution data working by creating
-- a default organization and assigning existing rows to it.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.organizations (name, slug)
values ('Liga de Oftalmologia da PUC', 'liga-oftalmo-puc')
on conflict (slug) do nothing;

alter table public.profiles
  add column if not exists organization_id uuid references public.organizations(id);

alter table public.locais_atendimento
  add column if not exists organization_id uuid references public.organizations(id);

alter table public.pacientes
  add column if not exists organization_id uuid references public.organizations(id);

alter table public.laudos
  add column if not exists organization_id uuid references public.organizations(id);

alter table public.activity_logs
  add column if not exists organization_id uuid references public.organizations(id);

update public.profiles
set organization_id = (select id from public.organizations where slug = 'liga-oftalmo-puc')
where organization_id is null;

update public.locais_atendimento
set organization_id = (select id from public.organizations where slug = 'liga-oftalmo-puc')
where organization_id is null;

update public.pacientes
set organization_id = (select id from public.organizations where slug = 'liga-oftalmo-puc')
where organization_id is null;

update public.laudos
set organization_id = (
  select p.organization_id
  from public.pacientes p
  where p.id = public.laudos.paciente_id
)
where organization_id is null;

update public.activity_logs
set organization_id = (
  select p.organization_id
  from public.profiles p
  where p.id = public.activity_logs.user_id
)
where organization_id is null;

alter table public.profiles
  alter column organization_id set not null;

alter table public.locais_atendimento
  alter column organization_id set not null;

alter table public.pacientes
  alter column organization_id set not null;

alter table public.laudos
  alter column organization_id set not null;

create index if not exists profiles_organization_id_idx
  on public.profiles(organization_id);

create index if not exists locais_atendimento_organization_id_idx
  on public.locais_atendimento(organization_id);

create index if not exists pacientes_organization_id_idx
  on public.pacientes(organization_id);

create index if not exists laudos_organization_id_idx
  on public.laudos(organization_id);

create index if not exists activity_logs_organization_id_idx
  on public.activity_logs(organization_id);

create or replace function public.current_user_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_organizations_updated_at on public.organizations;
create trigger touch_organizations_updated_at
before update on public.organizations
for each row execute function public.touch_updated_at();

alter table public.organizations enable row level security;

drop policy if exists "Users can read their own organization" on public.organizations;
create policy "Users can read their own organization"
on public.organizations
for select
using (id = public.current_user_organization_id());

drop policy if exists "Admins can update their own organization" on public.organizations;
create policy "Admins can update their own organization"
on public.organizations
for update
using (
  id = public.current_user_organization_id()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
)
with check (id = public.current_user_organization_id());
