import "./style.css";

import Lixeira from "../../assets/lixeira.icon.svg";

function Home() {
  const cobrancas = [
    {
      id: "34234543234",
      cliente: "João da Silva",
      valor: 150.0,
      vencimento: "2024-07-01",
      status: "PENDENTE",
    },
    {
      id: "3423454325345656",
      cliente: "Bruna",
      valor: 170.0,
      vencimento: "2022-05-02",
      status: "Pago",
    },
  ];
  return (
    <div className="container">
      <h1>MINI SISTEMA DE COBRANÇAS</h1>

      <div className="envolver">
        <div className="formulario">
          <form>
            <h2> Cadastrar Cobrança</h2>

            <input placeholder="Nome do cliente" name="nome" type="text" />

            <input placeholder="Valor da cobrança" name="valor" type="number" />
            <input placeholder="Data de vencimento" name="data" type="date" />
            <button type="button"> adicionar cobrança </button>
          </form>
        </div>

        <div className="lista-de-cobrancas">
          <h2>Lista de cobranças</h2>
          {cobrancas.map((cobranca) => (
            <div key={cobranca.id} className="cobranca">
              <div>
                <p>
                  {" "}
                  Nome: <span>{cobranca.cliente} </span>
                </p>

                <p>
                  {" "}
                  Valor: <span>R$ {cobranca.valor}</span>
                </p>

                <p>
                  {" "}
                  Data: <span>{cobranca.vencimento}</span>
                </p>

                <p>
                  Status: <button> {cobranca.status}</button>
                </p>
              </div>
              <button>
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
