import "./style.css";

import Lixeira from "../../assets/lixeira.icon.svg";

function Home() {
  return (
    <div className="container">
      <h1>MINI SISTEMA DE COBRANÇAS</h1>
      <form>
        <h2> Criar cobrança</h2>

        <input name="nome" type="text" />

        <input name="valor" type="number" />
        <input name="data" type="date" />
      </form>

      <div>
        <div>
          <p> Nome: </p>

          <p> Valor: R$</p>

          <p> Data: </p>

          <p>
            Status: <button> PENDENTE</button>
          </p>
        </div>
        <button>
          <img src={Lixeira} alt="Ícone de lixeira" />
        </button>
      </div>
    </div>
  );
}

export default Home;
