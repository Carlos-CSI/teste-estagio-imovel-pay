import { useEffect, useState, useRef } from "react";
import "./style.css";
import Lixeira from "../../assets/lixeira.icon.svg";
import api from "../../services/api";

function Home() {
  // estado para armazenar as cobranças que chegarem da API
  const [cobrancas, setCobrancas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos"); // "todos" | "pendente" | "pago"

  const inputNome = useRef();
  const inputValorCobranca = useRef();
  const inputDataVencimento = useRef();

  // função para buscar as cobranças da API e atualizar o estado
  async function mostrarCobrancas() {
    const cobrancasDaApi = await api.get("/cobranca");

    setCobrancas(cobrancasDaApi.data);
  }

  // função para filtrar as cobranças com base no status selecionado, onde se o filtro for "todos" ele retorna todas as cobranças, caso contrário ele retorna no array, apenas as cobranças que possuem status identico ao valor do estado filtroStatus.

  const cobrancasFiltradas = cobrancas.filter((cobranca) => {
    if (filtroStatus === "todos") return true; // mostra tudo
    return cobranca.status === filtroStatus; // mostra só pendente ou só pago
  });

  // função que inseri as validações do formulário, defini onde o value de cada input será guardado e a chamada para criar uma nova cobrança na API.

  async function criarCobranca() {
    // validações
    if (inputNome.current.value.length < 3) {
      alert("O nome precisa ter no mínimo 3 caracteres.");
      inputNome.current.focus();
      return;
    }

    if (
      !inputValorCobranca.current.value ||
      inputValorCobranca.current.value <= 0
    ) {
      alert("O valor deve ser maior que zero.");
      inputValorCobranca.current.focus();
      return;
    }

    await api.post("/cobranca", {
      nome: inputNome.current.value,
      valor: inputValorCobranca.current.value,
      vencimento: inputDataVencimento.current.value,
      status: "pendente",
    });

    // limpa os inputs após criar a cobrança.
    inputNome.current.value = "";
    inputValorCobranca.current.value = "";
    inputDataVencimento.current.value = "";

    mostrarCobrancas();
  }

  // função para atualizar o status da cobrança, alternando entre "pendente" e "pago", neste programa foi utilizado a lógica de que toda nova cobrança é criada com o status "pendente", e ao clicar no botão de status na lista de cobranças ele altera para "pago", fazendo a chamada para atualizar a cobrança na API e depois atualizando a lista de cobranças exibida.

  async function atualizarStatus(cobranca) {
    const novoStatus = cobranca.status === "pendente" ? "pago" : "pendente";

    await api.put(`/cobranca/${cobranca.id}`, { status: novoStatus });
    mostrarCobrancas();
  }

  // função para deletar uma cobrança, onde é feita a chamada para deletar a cobrança na API e depois atualizar a lista de cobranças exibida.

  async function deletarCobrancas(id) {
    await api.delete(`/cobranca/${id}`);

    mostrarCobrancas();
  }

  // useEffect para mostrar as cobranças assim que o componente for montado, fazendo a chamada para a função mostrarCobrancas.

  useEffect(() => {
    async function carregar() {
      await mostrarCobrancas();
    }

    carregar();
  }, []);

  return (
    <div className="container">
      <h1 className="titulo-formulario">MINI SISTEMA DE COBRANÇAS</h1>

      <div className="envolver">
        <div className="formulario">
          <form>
            <h2 className="titulo-cadastro-cobrancas"> Cadastrar cobrança</h2>

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
          <h2 className="titulo-lista-cobrancas">Lista de cobranças</h2>
          <div className="filtro-area">
            <label htmlFor="filtroStatus">Filtrar:</label>

            <select
              id="filtroStatus"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="pago">Pagos</option>
            </select>
            <span className="total">Total: {cobrancasFiltradas.length}</span>
          </div>

          {cobrancasFiltradas.map((cobranca) => (
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
                  Data de vencimento:{" "}
                  <span>
                    {cobranca.vencimento
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </span>
                </p>

                <p>
                  Status:{" "}
                  <button
                    className={`status ${cobranca.status}`}
                    onClick={() => atualizarStatus(cobranca)}
                  >
                    {cobranca.status}
                  </button>
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
