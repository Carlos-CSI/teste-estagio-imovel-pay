import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [cliente, setCliente] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [cobrancas, setCobrancas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar cobranças
  function carregarCobrancas() {
    setLoading(true);

    fetch(`${API_URL}/cobrancas`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar cobranças");
        return res.json();
      })
      .then(data => setCobrancas(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregarCobrancas();
  }, []);

  // 🔹 Cadastrar cobrança
  function cadastrarCobranca(e) {
    e.preventDefault();

    fetch(`${API_URL}/cobrancas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        valor,
        data,
        status: "Pendente",
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao cadastrar cobrança");
      })
      .then(() => {
        setCliente("");
        setValor("");
        setData("");
        carregarCobrancas();
      })
      .catch(err => console.error(err));
  }

  // 🔹 Marcar cobrança como paga
  function marcarComoPago(id) {
    fetch(`${API_URL}/cobrancas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Pago",
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar status");
      })
      .then(() => carregarCobrancas())
      .catch(err => console.error(err));
  }

  return (
    <div className="container">
      <h1>💰 Mini Sistema de Cobranças</h1>

      {/* NOVA COBRANÇA */}
      <div className="card">
        <h2>Nova Cobrança</h2>

        <form onSubmit={cadastrarCobranca} className="form">
          <input
            type="text"
            placeholder="Cliente"
            value={cliente}
            onChange={e => setCliente(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Valor (R$)"
            value={valor}
            onChange={e => setValor(e.target.value)}
            required
          />

          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />

          <button type="submit">➕ Criar Cobrança</button>
        </form>
      </div>

      {/* LISTA */}
      <div className="card">
        <h2>Cobranças Cadastradas</h2>

        {loading && <p>Carregando...</p>}

        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {!loading && cobrancas.length === 0 && (
              <tr>
                <td colSpan="5">Nenhuma cobrança cadastrada</td>
              </tr>
            )}

            {cobrancas.map(c => (
              <tr key={c.id}>
                <td>{c.cliente}</td>
                <td>R$ {c.valor}</td>
                <td>{c.data}</td>
                <td>
                  <span className={`status ${c.status?.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.status?.toLowerCase() === "pendente" && (
                    <button
                      className="btn-pago"
                      onClick={() => marcarComoPago(c.id)}
                    >
                     PAGO
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
