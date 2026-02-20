function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR");
}

function CobrancaList({ cobrancas, onMarkAsPaid, loadingId }) {
  if (cobrancas.length === 0) {
    return <p className="empty">Nenhuma cobranca cadastrada.</p>;
  }

  return (
    <ul className="list">
      {cobrancas.map((cobranca) => (
        <li key={cobranca.id} className="item card">
          <div>
            <p><strong>Cliente:</strong> {cobranca.nomeCliente}</p>
            <p><strong>Valor:</strong> {formatCurrency(cobranca.valor)}</p>
            <p><strong>Vencimento:</strong> {formatDate(cobranca.dataVencimento)}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={cobranca.status === "PAGO" ? "status paid" : "status pending"}>
                {cobranca.status}
              </span>
            </p>
          </div>

          <button
            disabled={cobranca.status === "PAGO" || loadingId === cobranca.id}
            onClick={() => onMarkAsPaid(cobranca.id)}
          >
            {loadingId === cobranca.id ? "Atualizando..." : "Marcar como PAGO"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default CobrancaList;
