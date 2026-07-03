-- Generic clinical documents foundation.
--
-- Used by the free "Documentos clínicos" module for exam requests and simple
-- white prescriptions. Kept specialty-agnostic on purpose.

create table if not exists public.clinical_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  paciente_id uuid references public.pacientes(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  document_type text not null check (document_type in ('exam_request', 'white_prescription')),
  title text not null,
  content text not null,
  status text not null default 'issued' check (status in ('draft', 'issued', 'cancelled')),
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clinical_documents_organization_id_idx
  on public.clinical_documents(organization_id);

create index if not exists clinical_documents_paciente_id_idx
  on public.clinical_documents(paciente_id);

create index if not exists clinical_documents_created_by_idx
  on public.clinical_documents(created_by);

create index if not exists clinical_documents_document_type_idx
  on public.clinical_documents(document_type);

drop trigger if exists touch_clinical_documents_updated_at on public.clinical_documents;
create trigger touch_clinical_documents_updated_at
before update on public.clinical_documents
for each row execute function public.touch_updated_at();

alter table public.clinical_documents enable row level security;

drop policy if exists "Users can read clinical documents from their organization"
on public.clinical_documents;
create policy "Users can read clinical documents from their organization"
on public.clinical_documents
for select
using (organization_id = public.current_user_organization_id());

drop policy if exists "Users can insert clinical documents in their organization"
on public.clinical_documents;
create policy "Users can insert clinical documents in their organization"
on public.clinical_documents
for insert
with check (organization_id = public.current_user_organization_id());

drop policy if exists "Users can update clinical documents from their organization"
on public.clinical_documents;
create policy "Users can update clinical documents from their organization"
on public.clinical_documents
for update
using (organization_id = public.current_user_organization_id())
with check (organization_id = public.current_user_organization_id());
