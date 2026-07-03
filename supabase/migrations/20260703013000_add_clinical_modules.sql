-- Clinical module catalog and organization licensing foundation.
--
-- The product starts with the ophthalmology module, but organizations should
-- eventually be able to license different clinical specialties.

create table if not exists public.clinical_modules (
  id text primary key,
  name text not null,
  specialty text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_modules (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  module_id text not null references public.clinical_modules(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'inactive')),
  enabled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, module_id)
);

insert into public.clinical_modules (id, name, specialty, description)
values (
  'oftalmo',
  'Oftalmo',
  'Oftalmologia',
  'Triagem oftalmológica, retinografia, acompanhamento de laudos e indicadores de retinopatia.'
)
on conflict (id) do update
set
  name = excluded.name,
  specialty = excluded.specialty,
  description = excluded.description,
  updated_at = now();

insert into public.organization_modules (organization_id, module_id)
select id, 'oftalmo'
from public.organizations
on conflict (organization_id, module_id) do nothing;

create index if not exists organization_modules_module_id_idx
  on public.organization_modules(module_id);

create index if not exists organization_modules_status_idx
  on public.organization_modules(status);

drop trigger if exists touch_clinical_modules_updated_at on public.clinical_modules;
create trigger touch_clinical_modules_updated_at
before update on public.clinical_modules
for each row execute function public.touch_updated_at();

drop trigger if exists touch_organization_modules_updated_at on public.organization_modules;
create trigger touch_organization_modules_updated_at
before update on public.organization_modules
for each row execute function public.touch_updated_at();

alter table public.clinical_modules enable row level security;
alter table public.organization_modules enable row level security;

drop policy if exists "Authenticated users can read active clinical modules"
on public.clinical_modules;
create policy "Authenticated users can read active clinical modules"
on public.clinical_modules
for select
using (status = 'active' and auth.uid() is not null);

drop policy if exists "Users can read modules from their organization"
on public.organization_modules;
create policy "Users can read modules from their organization"
on public.organization_modules
for select
using (
  organization_id = public.current_user_organization_id()
  or exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'developer'
  )
);

drop policy if exists "Developers can manage organization modules"
on public.organization_modules;
create policy "Developers can manage organization modules"
on public.organization_modules
for all
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'developer'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'developer'
  )
);
