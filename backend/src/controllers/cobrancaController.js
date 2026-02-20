const service = require("../services/cobrancaService");

function list(req, res) {
  const cobrancas = service.listCobrancas();
  return res.json(cobrancas);
}

function create(req, res) {
  const result = service.createCobranca(req.body);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  return res.status(result.statusCode).json(result.data);
}

function markAsPaid(req, res) {
  const id = Number(req.params.id);
  const result = service.markCobrancaAsPaid(id);

  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  return res.json(result.data);
}

module.exports = {
  list,
  create,
  markAsPaid
};
