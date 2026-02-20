function CobrancaTable({ cobrancas, onEditar, onPagar }) {
  return (
    <table className="tabela-cobranca">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Valor</th>
          <th>Vencimento</th>
          <th>Status</th>
          <th>Ação</th>
        </tr>
      </thead>

      <tbody>
        {cobrancas.map((item) => (
          <tr key={item.id}>
            <td>{item.nomeCliente}</td>
            <td>{item.cpf}</td>
            <td>{item.email}</td>
            <td>{item.telefone}</td>

            <td>
              {item.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </td>

            <td>{item.dataVencimento}</td>

            <td>
              <span
                className={
                  item.status === "PENDENTE" ? "status-pendente" : "status-pago"
                }
              >
                {item.status}
              </span>
            </td>

            <td>
              <button className="btn-editar" onClick={() => onEditar(item)}>
                Editar
              </button>

              {item.status === "PENDENTE" && (
                <button className="btn-pagar" onClick={() => onPagar(item.id)}>
                  Pagar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CobrancaTable;
