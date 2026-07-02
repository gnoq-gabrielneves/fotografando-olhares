const LOWERCASE_WORDS = new Set([
  "a",
  "as",
  "com",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "para",
  "por",
]);

const UPPERCASE_WORDS = new Set([
  "aps",
  "ce",
  "cpf",
  "cns",
  "has",
  "rd",
  "sus",
  "ubs",
  "upa",
]);

function formatWord(word: string, index: number) {
  const lower = word
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLocaleLowerCase("pt-BR");

  if (UPPERCASE_WORDS.has(lower)) {
    return lower.toLocaleUpperCase("pt-BR");
  }

  if (index > 0 && LOWERCASE_WORDS.has(lower)) {
    return lower;
  }

  return lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
}

export function formatDisplayText(value: string | null | undefined) {
  if (!value) return "";

  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word, index) =>
      word
        .split("-")
        .map((part, partIndex) => formatWord(part, index + partIndex))
        .join("-"),
    )
    .join(" ");
}

export function formatDisplayTextOrDash(value: string | null | undefined) {
  return formatDisplayText(value) || "—";
}

export function formatSentenceStart(value: string | null | undefined) {
  if (!value) return "";

  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.replace(/^(\p{L})/u, (letter) =>
    letter.toLocaleUpperCase("pt-BR"),
  );
}
