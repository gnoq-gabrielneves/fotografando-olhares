function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export function markdownToHtml(value: string | null | undefined) {
  const lines = String(value ?? "").split("\n");
  const html: string[] = [];
  let activeList: "ol" | "ul" | null = null;

  function closeList() {
    if (!activeList) return;
    html.push(`</${activeList}>`);
    activeList = null;
  }

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      closeList();
      continue;
    }

    const headingMatch = /^(#{1,4})\s*(.+)$/.exec(trimmedLine);
    if (headingMatch) {
      closeList();
      const level = Math.min(headingMatch[1].length + 1, 5);
      html.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const unorderedMatch = /^[-*]\s*(.+)$/.exec(trimmedLine);
    if (unorderedMatch) {
      if (activeList !== "ul") {
        closeList();
        html.push("<ul>");
        activeList = "ul";
      }
      html.push(`<li>${renderInlineMarkdown(unorderedMatch[1])}</li>`);
      continue;
    }

    const orderedMatch = /^\d+\.\s*(.+)$/.exec(trimmedLine);
    if (orderedMatch) {
      if (activeList !== "ol") {
        closeList();
        html.push("<ol>");
        activeList = "ol";
      }
      html.push(`<li>${renderInlineMarkdown(orderedMatch[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(trimmedLine)}</p>`);
  }

  closeList();

  if (!html.length) {
    return '<p class="empty">O preview aparece conforme você escreve.</p>';
  }

  return html.join("");
}
