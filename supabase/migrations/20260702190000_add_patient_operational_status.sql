-- Patient operational pipeline.
--
-- Adds a typed workflow status used to track pending work from triage to
-- follow-up resolution.

alter table public.pacientes
  add column if not exists status_operacional text not null default 'cadastrado'
  check (
    status_operacional in (
      'cadastrado',
      'imagem_capturada',
      'aguardando_laudo',
      'laudado',
      'encaminhado',
      'resolvido'
    )
  );

update public.pacientes p
set status_operacional = 'laudado'
where exists (
  select 1
  from public.laudos l
  where l.paciente_id = p.id
)
and p.status_operacional = 'cadastrado';

create index if not exists pacientes_status_operacional_idx
  on public.pacientes(status_operacional);

create index if not exists pacientes_organization_status_operacional_idx
  on public.pacientes(organization_id, status_operacional);
