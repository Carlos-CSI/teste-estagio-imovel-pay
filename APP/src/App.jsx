import { useState, useEffect, useRef } from "react";
import api from "./services/api";
import CobrancaForm from "./components/cobrancaForm";
import CobrancaTable from "./components/cobrancaTable";
import Pagination from "./components/pagination";
import "./App.css";

function App() {
  const [cobrancas, setCobrancas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cobrancaEditando, setCobrancaEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const topoRef = useRef(null);

  useEffect(() => {
    buscarCobrancas();
  }, [paginaAtual, pesquisa]);

  async function buscarCobrancas() {
    try {
      const resposta = await api.get(
        `/cobranca?page=${paginaAtual}&nome=${pesquisa}`
      );
      setCobrancas(resposta.data.content);
      setTotalPaginas(resposta.data.totalPages);
    } catch (erro) {
      console.error(erro);
    }
  }

  useEffect(() => {
    if (mostrarFormulario) {
      topoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [mostrarFormulario]);

  const salvar = async (dados) => {
    setLoading(true);
    try {
      if (cobrancaEditando) {
        await api.put(`/cobranca/${cobrancaEditando.id}`, dados);
        alert("Cobrança atualizada com sucesso!"); // Alerta para edição
      } else {
        await api.post("/cobranca", dados);
        alert("Nova cobrança cadastrada com sucesso!"); // Alerta para nova
      }

      setMostrarFormulario(false);
      setCobrancaEditando(null);
      buscarCobrancas();
    } catch (erro) {
      alert("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  const pagar = async (id) => {
    if (!window.confirm("Confirmar pagamento?")) return;

    try {
      await api.put(`/cobranca/${id}/pagar/`);
      buscarCobrancas();
    } catch (erro) {
      console.error("Erro real:", erro.response || erro);
      alert("Erro ao pagar");
    }
  };

  return (
    <>
      <div ref={topoRef}></div>

      <h1>Sistema de Cobrança</h1>

      {!mostrarFormulario && (
        <button
          className="btn-novaCobranca"
          onClick={() => {
            setCobrancaEditando(null);
            setMostrarFormulario(true);
          }}
        >
          ➕ Nova Cobrança
        </button>
      )}
      {mostrarFormulario && (
        <CobrancaForm
          onSalvar={salvar}
          onCancelar={() => setMostrarFormulario(false)}
          cobrancaEditando={cobrancaEditando}
          loading={loading}
        />
      )}
      <div className="busca-container">
        <input
          placeholder="Buscar por nome..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>
      <CobrancaTable
        cobrancas={cobrancas}
        onEditar={(item) => {
          setCobrancaEditando(item);
          setMostrarFormulario(true);
        }}
        onPagar={pagar}
      />
      <Pagination
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        onChange={setPaginaAtual}
      />
    </>
  );
}

export default App;
