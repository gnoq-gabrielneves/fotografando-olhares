const PACIENTES_RETURN_URL_KEY = "fotografando-olhares:pacientes-return-url";

export function savePacientesReturnUrl(url: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PACIENTES_RETURN_URL_KEY, url);
}

export function getPacientesReturnUrl() {
  if (typeof window === "undefined") return "/pacientes";
  return window.sessionStorage.getItem(PACIENTES_RETURN_URL_KEY) || "/pacientes";
}

