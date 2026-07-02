# Fotografando Olhares Roadmap

## Produto

O objetivo e transformar o app de um sistema interno da Liga de Oftalmologia da PUC em uma plataforma para triagens oftalmologicas, retinografia e acompanhamento de laudos em multiplas instituicoes.

## Fase 1: Multi-instituicao

Status: em andamento.

Entregas desta fase:

- Criar a tabela `organizations`.
- Associar `profiles`, `locais_atendimento`, `pacientes`, `laudos` e `activity_logs` a uma organizacao.
- Migrar os dados atuais para a organizacao padrao `Liga de Oftalmologia da PUC`.
- Preparar politicas de acesso por organizacao.
- Depois da migration aplicada, filtrar telas e relatorios pelo `organization_id` do usuario logado.

## Fase 2: Esteira clinica

Status: em andamento.

Adicionar status operacional para cada paciente:

- `cadastrado`
- `imagem_capturada`
- `aguardando_laudo`
- `laudado`
- `encaminhado`
- `resolvido`

Essa fase deve permitir listas de pendencias, tempo medio ate laudo e acompanhamento de encaminhamentos.

Entregas iniciadas:

- Campo `status_operacional` em pacientes, com migration e indices.
- Filtro e badge de status na lista de pacientes.
- Edicao manual do status no cadastro do paciente.
- Atualizacao automatica para `laudado` ao emitir um laudo.
- Relatorio de esteira clinica com pendencias, distribuicao por status e tempo medio ate laudo.
- Backfill da base historica: pacientes sem laudo entram como `aguardando_laudo`, pacientes com laudo entram como `laudado`.

## Fase 3: Imagens e laudo profissional

Adicionar imagens do exame por paciente/laudo, separando OD/OE quando fizer sentido, com geracao de PDF do laudo e campos clinicos mais estruturados.

## Fase 4: Relatorios executivos

Evoluir os relatorios para impacto, produtividade, prevalencia, pendencias e indicadores por instituicao/local.

## Fase 5: LGPD e auditoria

Fortalecer consentimento, trilha de auditoria, mascaramento de dados sensiveis, controle de exclusao e retencao.
