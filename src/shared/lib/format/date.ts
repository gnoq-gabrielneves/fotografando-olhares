export function parseBrazilianDateToIso(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return "";

  const [day, month, year] = value.split("/");
  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  const date = new Date(yearNumber, monthNumber - 1, dayNumber);

  if (
    date.getFullYear() !== yearNumber ||
    date.getMonth() !== monthNumber - 1 ||
    date.getDate() !== dayNumber
  ) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

export function formatIsoDateToBrazilian(value: string | null | undefined) {
  if (!value) return null;

  const [datePart] = value.split("T");
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return null;
  return `${day}/${month}/${year}`;
}

export function formatDateTimeToBrazilian(value: string | null | undefined) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}
