-- Free baseline clinical documents module.
--
-- This module should be available to every customer regardless of specialty
-- licensing. Product scope: exam requests and simple white prescriptions.

insert into public.clinical_modules (id, name, specialty, description)
values (
  'documentos',
  'Documentos clínicos',
  'Documentos gerais',
  'Solicitação de exames e emissão de receitas brancas simples para fluxos clínicos gerais.'
)
on conflict (id) do update
set
  name = excluded.name,
  specialty = excluded.specialty,
  description = excluded.description,
  status = 'active',
  updated_at = now();

insert into public.organization_modules (organization_id, module_id, status)
select id, 'documentos', 'active'
from public.organizations
on conflict (organization_id, module_id) do update
set
  status = 'active',
  updated_at = now();
