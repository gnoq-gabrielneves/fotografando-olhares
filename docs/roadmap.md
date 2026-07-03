# Fotografando Olhares Roadmap

## Produto

O objetivo é transformar o app de um sistema interno da Liga de Oftalmologia da PUC em uma plataforma clínica licenciável, multi-instituição e multi-especialidade.

A direção de produto é parecida com um ERP clínico: um core comum para organizações, usuários, pacientes, atendimentos, documentos, auditoria, treinamento e relatórios; e módulos clínicos por especialidade. O módulo inicial é `oftalmo`, com triagem oftalmológica, retinografia e acompanhamento de laudos.

## Princípios de modularização

- O core não deve depender de conceitos exclusivos de uma especialidade.
- Cada módulo clínico pode ter vocabulário, campos, resultados, documentos, templates e relatórios próprios.
- Alguns módulos podem ser core/gratuitos para todos os clientes, enquanto especialidades avançadas podem compor a licença.
- Oftalmo continua sendo o módulo ativo no curto prazo, mas novas decisões devem evitar travar o produto em retinografia ou RD.
- Relatórios executivos devem separar indicadores gerais do fluxo clínico e indicadores específicos do módulo.

## Fase 1: Multi-instituição

Status: em andamento.

Entregas desta fase:

- Criar a tabela `organizations`.
- Associar `profiles`, `locais_atendimento`, `pacientes`, `laudos` e `activity_logs` a uma organização.
- Migrar os dados atuais para a organização padrão `Liga de Oftalmologia da PUC`.
- Preparar políticas de acesso por organização.
- Depois da migration aplicada, filtrar telas e relatorios pelo `organization_id` do usuario logado.

## Fase 1.5: Plataforma modular

Status: iniciada.

Entregas desta fase:

- Declarar o módulo clínico ativo (`oftalmo`) como configuração explícita do produto.
- Centralizar vocabulário clínico por módulo.
- Criar catálogo de módulos clínicos e vínculo de módulos habilitados por organização.
- Criar módulo core gratuito de Documentos Clínicos, com base para solicitação de exames e receitas brancas.
- Separar documentação e treinamento em conteúdo operacional comum e conteúdo específico do módulo.
- Preparar o banco para múltiplos módulos por organização antes de vender licenças com especialidades diferentes.
- Planejar migração futura de campos específicos de oftalmo para estruturas de exame/documento por módulo.

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

## Fase 3: Imagens e documento clínico profissional

Adicionar anexos/imagens de exame por paciente/documento clínico, com templates por módulo. No módulo Oftalmo, isso inclui separação OD/OE quando fizer sentido, geração de PDF do laudo e campos clínicos mais estruturados.

## Fase 3.5: Documentos clínicos gratuitos

Status: planejada.

Criar um módulo core disponível para todo cliente:

- Solicitação de exames.
- Receita branca simples.
- Histórico de documentos por paciente.
- Impressão/exportação em PDF.
- Campos de profissional responsável, CRM/UF quando aplicável, data, orientações e assinatura.
- Auditoria de emissão, edição e cancelamento.

Antes de uso em produção, validar requisitos regulatórios, assinatura, responsabilidade profissional e política de armazenamento.

## Fase 4: Relatorios executivos

Evoluir os relatorios para impacto, produtividade, prevalencia, pendencias e indicadores por instituicao/local.

## Fase 5: LGPD e auditoria

Fortalecer consentimento, trilha de auditoria, mascaramento de dados sensiveis, controle de exclusao e retencao.
