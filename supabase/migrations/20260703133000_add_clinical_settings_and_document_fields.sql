-- Clinical document configuration and richer patient/document metadata.

create table if not exists public.clinical_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  clinic_name text,
  clinic_logo_url text,
  clinic_city text,
  physician_name text,
  physician_crm text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists touch_clinical_settings_updated_at on public.clinical_settings;
create trigger touch_clinical_settings_updated_at
before update on public.clinical_settings
for each row execute function public.touch_updated_at();

alter table public.clinical_settings enable row level security;

drop policy if exists "Users can read clinical settings from their organization"
on public.clinical_settings;
create policy "Users can read clinical settings from their organization"
on public.clinical_settings
for select
using (public.current_user_can_access_organization(organization_id));

drop policy if exists "Admins can manage clinical settings from their organization"
on public.clinical_settings;
create policy "Admins can manage clinical settings from their organization"
on public.clinical_settings
for all
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

alter table public.pacientes
  add column if not exists nome_mae text,
  add column if not exists telefone text,
  add column if not exists endereco text;

alter table public.clinical_documents
  add column if not exists clinic_name text,
  add column if not exists clinic_logo_url text,
  add column if not exists clinic_city text,
  add column if not exists physician_name text,
  add column if not exists physician_crm text,
  add column if not exists clinical_justification text,
  add column if not exists material_to_examine text;

