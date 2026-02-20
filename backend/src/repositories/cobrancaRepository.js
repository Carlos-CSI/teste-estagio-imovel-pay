let cobrancas = [];
let nextId = 1;

function findAll() {
  return [...cobrancas].sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
}

function findById(id) {
  return cobrancas.find((cobranca) => cobranca.id === id);
}

function create(data) {
  const novaCobranca = {
    id: nextId++,
    nomeCliente: data.nomeCliente,
    valor: data.valor,
    dataVencimento: data.dataVencimento,
    status: "PENDENTE"
  };

  cobrancas.push(novaCobranca);
  return novaCobranca;
}

function markAsPaid(id) {
  const cobranca = findById(id);
  if (!cobranca) {
    return null;
  }

  cobranca.status = "PAGO";
  return cobranca;
}

module.exports = {
  findAll,
  findById,
  create,
  markAsPaid
};
