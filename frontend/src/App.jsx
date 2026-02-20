import { useEffect, useState } from "react";
import "./App.css";
import CobrancaForm from "./components/CobrancaForm";
import CobrancaList from "./components/CobrancaList";
import { criarCobranca, listarCobrancas, marcarComoPago } from "./services/api";

function App() {
  const [cobrancas, setCobrancas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function carregarCobrancas() {
    try {
      setLoading(true);
      setError("");
      const data = await listarCobrancas();
      setCobrancas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCobrancas();
  }, []);

  async function handleCreate(payload) {
    try {
      setSaving(true);
      setError("");
      await criarCobranca(payload);
      await carregarCobrancas();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkAsPaid(id) {
    try {
      setUpdatingId(id);
      setError("");
      await marcarComoPago(id);
      await carregarCobrancas();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Mini Sistema de Cobrancas</h1>
        <p>Gestao simples de cobrancas com atualizacao de status.</p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <CobrancaForm onSubmit={handleCreate} loading={saving} />

      <section className="card">
        <h2>Lista de cobrancas</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <CobrancaList
            cobrancas={cobrancas}
            onMarkAsPaid={handleMarkAsPaid}
            loadingId={updatingId}
          />
        )}
      </section>
    </main>
  );
}

export default App;
