const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Falha na requisicao");
  }

  return data;
}

export function listarCobrancas() {
  return request("/cobrancas");
}

export function criarCobranca(payload) {
  return request("/cobrancas", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function marcarComoPago(id) {
  return request(`/cobrancas/${id}/status`, {
    method: "PATCH"
  });
}
