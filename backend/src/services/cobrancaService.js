const repository = require("../repositories/cobrancaRepository");

function validateCreateInput(payload) {
  const { nomeCliente, valor, dataVencimento } = payload;

  if (!nomeCliente || valor === undefined || !dataVencimento) {
    return "Campos obrigatorios: nomeCliente, valor, dataVencimento";
  }

  if (typeof nomeCliente !== "string" || !nomeCliente.trim()) {
    return "nomeCliente deve ser um texto valido";
  }

  if (typeof valor !== "number" || Number.isNaN(valor) || valor <= 0) {
    return "valor deve ser um numero maior que zero";
  }

  const vencimento = new Date(dataVencimento);
  if (Number.isNaN(vencimento.getTime())) {
    return "dataVencimento invalida";
  }

  return null;
}

function listCobrancas() {
  return repository.findAll();
}

function createCobranca(payload) {
  const error = validateCreateInput(payload);
  if (error) {
    return { error, statusCode: 400 };
  }

  const cobranca = repository.create({
    nomeCliente: payload.nomeCliente.trim(),
    valor: payload.valor,
    dataVencimento: payload.dataVencimento
  });

  return { data: cobranca, statusCode: 201 };
}

function markCobrancaAsPaid(id) {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "id invalido", statusCode: 400 };
  }

  const updated = repository.markAsPaid(id);
  if (!updated) {
    return { error: "Cobranca nao encontrada", statusCode: 404 };
  }

  return { data: updated, statusCode: 200 };
}

module.exports = {
  listCobrancas,
  createCobranca,
  markCobrancaAsPaid
};
