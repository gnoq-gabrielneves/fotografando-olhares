import type { DocumentoClinicoTabela } from "@/shared/types";
import { markdownToHtml } from "./documento-markdown";
import { documentoTipoLabel } from "./documentos-labels";

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

function formatShortDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

function formatSexo(value: string | null | undefined) {
  if (value === "M") return "Masculino";
  if (value === "F") return "Feminino";
  return "-";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function getDocumentoFileName(documento: DocumentoClinicoTabela) {
  const title = slugify(documento.title) || "documento-clinico";
  return `${title}.html`;
}

export function buildDocumentoHtml(documento: DocumentoClinicoTabela) {
  const tipo = documentoTipoLabel[documento.document_type];
  const paciente = documento.pacientes?.nome_completo ?? "Sem paciente vinculado";
  const dataEmissao = formatDate(documento.issued_at ?? documento.created_at);
  const localData = [documento.clinic_city, dataEmissao].filter(Boolean).join(", ");
  const physicianName = documento.physician_name ?? "Médica responsável";
  const physicianCrm = documento.physician_crm ?? "CRM não informado";
  const content = markdownToHtml(documento.content);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(documento.title)}</title>
    <style>
      @page { margin: 20mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #172033;
        background: #f8fafc;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.5;
      }
      .page {
        width: min(210mm, calc(100vw - 32px));
        min-height: 297mm;
        margin: 24px auto;
        padding: 22mm 20mm;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
      }
      .eyebrow {
        margin: 0 0 8px;
        color: #0891b2;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .doc-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
        margin-bottom: 28px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .logo {
        width: 56px;
        height: 56px;
        object-fit: contain;
      }
      .clinic-name {
        margin: 0;
        color: #0f172a;
        font-size: 16px;
        font-weight: 700;
      }
      .issued-place {
        margin: 0;
        color: #64748b;
        font-size: 12px;
        text-align: right;
      }
      h1 {
        margin: 0;
        color: #0f172a;
        font-size: 24px;
        line-height: 1.2;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 28px 0;
        padding: 16px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #f8fafc;
      }
      .label {
        display: block;
        color: #64748b;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .value {
        display: block;
        margin-top: 4px;
        color: #1e293b;
        font-size: 14px;
        font-weight: 600;
      }
      .content {
        min-height: 420px;
        color: #1f2937;
        font-size: 15px;
        white-space: normal;
      }
      .content h2,
      .content h3,
      .content h4,
      .content h5 {
        margin: 18px 0 8px;
        color: #0f172a;
        font-size: 16px;
        line-height: 1.35;
      }
      .content p {
        margin: 0 0 10px;
      }
      .content ul,
      .content ol {
        margin: 0 0 14px 22px;
        padding: 0;
      }
      .content li {
        margin: 4px 0;
      }
      .content strong {
        color: #0f172a;
      }
      .content code {
        border-radius: 4px;
        background: #f1f5f9;
        padding: 1px 4px;
        font-family: "Courier New", monospace;
        font-size: 13px;
      }
      .content .empty {
        color: #94a3b8;
      }
      .content-title {
        margin: 0 0 12px;
        color: #64748b;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .signature {
        margin-top: 72px;
        padding-top: 18px;
        border-top: 1px solid #94a3b8;
        width: 320px;
        color: #475569;
        text-align: center;
        font-size: 12px;
      }
      .disclaimer {
        margin-top: 36px;
        padding-top: 14px;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
        font-size: 11px;
      }
      @media print {
        body { background: #ffffff; }
        .page {
          width: auto;
          min-height: auto;
          margin: 0;
          padding: 0;
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="doc-header">
        <div class="brand">
          ${
            documento.clinic_logo_url
              ? `<img class="logo" src="${escapeHtml(documento.clinic_logo_url)}" alt="" />`
              : ""
          }
          <div>
            <p class="clinic-name">${escapeHtml(documento.clinic_name ?? "Clínica/Hospital")}</p>
            <p class="eyebrow">${escapeHtml(tipo)}</p>
          </div>
        </div>
        <p class="issued-place">${escapeHtml(localData || dataEmissao)}</p>
      </header>
      <h1>${escapeHtml(documento.title)}</h1>
      <section class="meta" aria-label="Dados do paciente">
        <div>
          <span class="label">Paciente</span>
          <span class="value">${escapeHtml(paciente)}</span>
        </div>
        <div>
          <span class="label">Nascimento</span>
          <span class="value">${escapeHtml(formatShortDate(documento.pacientes?.data_nascimento ?? null))}</span>
        </div>
        <div>
          <span class="label">Sexo</span>
          <span class="value">${escapeHtml(formatSexo(documento.pacientes?.sexo))}</span>
        </div>
        <div>
          <span class="label">Nome da mãe</span>
          <span class="value">${escapeHtml(documento.pacientes?.nome_mae ?? "-")}</span>
        </div>
        <div>
          <span class="label">Telefone</span>
          <span class="value">${escapeHtml(documento.pacientes?.telefone ?? "-")}</span>
        </div>
        <div>
          <span class="label">Endereço</span>
          <span class="value">${escapeHtml(documento.pacientes?.endereco ?? "-")}</span>
        </div>
      </section>
      ${
        documento.clinical_justification || documento.material_to_examine
          ? `<section class="meta" aria-label="Informações clínicas">
        <div>
          <span class="label">Justificativa clínica</span>
          <span class="value">${escapeHtml(documento.clinical_justification ?? "-")}</span>
        </div>
        <div>
          <span class="label">Material a examinar</span>
          <span class="value">${escapeHtml(documento.material_to_examine ?? "-")}</span>
        </div>
      </section>`
          : ""
      }
      <section class="content">
        <p class="content-title">Conteúdo</p>
        ${content}
      </section>
      <footer class="signature">
        <strong>${escapeHtml(physicianName)}</strong><br />
        ${escapeHtml(physicianCrm)}
      </footer>
      <p class="disclaimer">
        Documento emitido pelo sistema Fotografando Olhares. Antes de uso externo,
        valide identificação profissional, assinatura e requisitos regulatórios aplicáveis.
      </p>
    </main>
  </body>
</html>`;
}

export function downloadDocumento(documento: DocumentoClinicoTabela) {
  const blob = new Blob([buildDocumentoHtml(documento)], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getDocumentoFileName(documento);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printDocumento(documento: DocumentoClinicoTabela) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(buildDocumentoHtml(documento));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
  }, 250);
}
