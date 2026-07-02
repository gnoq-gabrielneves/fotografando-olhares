-- Reclassify the initial backlog after the patient pipeline was introduced.
--
-- In the migrated historical data, patients without a report are operationally
-- waiting for a report, not merely newly registered.

update public.pacientes p
set status_operacional = 'laudado'
where exists (
  select 1
  from public.laudos l
  where l.paciente_id = p.id
)
and p.status_operacional <> 'laudado';

update public.pacientes p
set status_operacional = 'aguardando_laudo'
where not exists (
  select 1
  from public.laudos l
  where l.paciente_id = p.id
)
and p.status_operacional = 'cadastrado';
