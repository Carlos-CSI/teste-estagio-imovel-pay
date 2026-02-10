const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "../data/cobrancas.json");

function lerArquivo() {
  return JSON.parse(fs.readFileSync(arquivo, "utf-8"));
}

function salvarArquivo(dados) {
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

// 📌 LISTAR
function listar() {
  return lerArquivo();
}

// 📌 CRIAR
function criar(dados) {
  const cobrancas = lerArquivo();

  const novaCobranca = {
    id: Date.now(),
    cliente: dados.cliente,
    valor: dados.valor,
    data: dados.data,
    status: dados.status || "Pendente",
  };

  cobrancas.push(novaCobranca);
  salvarArquivo(cobrancas);

  return novaCobranca;
}

// 📌 ATUALIZAR STATUS
function atualizarStatus(id, status) {
  const cobrancas = lerArquivo();

  const cobranca = cobrancas.find(c => c.id == id);
  if (!cobranca) return null;

  cobranca.status = status;
  salvarArquivo(cobrancas);

  return cobranca;
}

module.exports = {
  listar,
  criar,
  atualizarStatus,
};