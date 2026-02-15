import { useEffect, useState, useRef } from "react";
import "./style.css";
import Lixeira from "../../assets/lixeira.icon.svg";
import api from "../../services/api";

function Home() {
  const [cobrancas, setCobrancas] = useState([]);

  const inputNome = useRef();
  const inputValorCobranca = useRef();
  const inputDataVencimento = useRef();

  async function mostrarCobrancas() {
    const cobrancasDaApi = await api.get("/cobranca");

    setCobrancas(cobrancasDaApi.data);
  }

  async function criarCobranca() {
    await api.post("/cobranca", {
      nome: inputNome.current.value,
      valor: inputValorCobranca.current.value,
      vencimento: inputDataVencimento.current.value,
      status: "pendente",
    });

    mostrarCobrancas();
  }

  async function deletarCobrancas(id) {
    await api.delete(`/cobranca/${id}`);

    mostrarCobrancas();
  }

  useEffect(() => {
    mostrarCobrancas();
  }, []);

  return (
    <div className="container">
      <h1>MINI SISTEMA DE COBRANÇAS</h1>

      <div className="envolver">
        <div className="formulario">
          <form>
            <h2> Cadastrar Cobrança</h2>

            <input
              placeholder="Nome do cliente"
              name="nome"
              type="text"
              ref={inputNome}
            />

            <input
              placeholder="Valor da cobrança"
              name="valor"
              type="number"
              ref={inputValorCobranca}
            />
            <input
              placeholder="Data de vencimento"
              name="data"
              type="date"
              ref={inputDataVencimento}
            />
            <button type="button" onClick={criarCobranca}>
              adicionar cobrança
            </button>
          </form>
        </div>

        <div className="lista-de-cobrancas">
          <h2>Lista de cobranças</h2>
          {cobrancas.map((cobranca) => (
            <div key={cobranca.id} className="cobranca">
              <div>
                <p>
                  {" "}
                  Nome: <span>{cobranca.nome} </span>
                </p>

                <p>
                  {" "}
                  Valor: <span>R$ {cobranca.valor}</span>
                </p>

                <p>
                  {" "}
                  Data de vencimento: <span>{cobranca.vencimento}</span>
                </p>

                <p>
                  Status: <button> {cobranca.status}</button>
                </p>
              </div>
              <button onClick={() => deletarCobrancas(cobranca.id)}>
                <img src={Lixeira} alt="Ícone de lixeira" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
