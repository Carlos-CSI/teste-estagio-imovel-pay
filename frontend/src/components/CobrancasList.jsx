export function CobrancasList({ cobrancas, onPagar }) {
  return (
    <ul>
      {cobrancas.map(c => (
        <li key={c.id}>
          {c.nomeCliente} - R${c.valor} - {c.status}

          {c.status === 'PENDENTE' && (
            <button onClick={() => onPagar(c.id)}>Pagar</button>
          )}
        </li>
      ))}
    </ul>
  );
}