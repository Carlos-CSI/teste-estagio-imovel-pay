import { useState } from 'react'
import './App.css'

function App() {

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cobrancas, setCobrancas] = useState([]);

  const [nome_cliente, setnome_cliente] = useState("");
  const [valor, setvalor] = useState("");
  const [data_vencimento, setdata_vencimento] = useState("");
  const [status, setstatus] = useState("pendente");
 
 //Lista as cobranças do banco de dados
  const listar_cobrancas = async () => {
    const resposta = await fetch("http://localhost:8000/cobrancas");
    const dados = await resposta.json();
    setCobrancas(dados);
  }

  //Atualiza o status da cobrança
  
  const atualizarStatus = async (id, novoStatus) => {
    await fetch(`http://localhost:8000/cobrancas/${id}`, { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: novoStatus
      }),
    });
    listar_cobrancas();
  }
 
 //Salva a cobrança no banco de dados
  const salvarCobranca = async () => {
    await fetch("http://localhost:8000/cobrancas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_cliente,
        valor: Number(valor),
        data_vencimento,
        status,
      }),
    });

    setMostrarFormulario(false);
    setnome_cliente("");
    setvalor("");
    setdata_vencimento("");
    setstatus("");
    listar_cobrancas();
  };

  return (
    <>
    <div>
             {/* LISTAGEM */}
    <button type="button" onClick={listar_cobrancas}>
    Listar cobranças
    </button>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {cobrancas.map((c) => (
            <tr key={c.id}>
              <td>{c.nome_cliente}</td>
              <td>R$ {c.valor}</td>
              <td>{c.data_vencimento}</td>
              <td>{c.status}</td>
              <td>
                {c.status === "pendente" && (
                  <button onClick={() => atualizarStatus(c.id, "pago")}>
                    Marcar como pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    
    
    
    
    <div>
      <button type="button" onClick={() => setMostrarFormulario(true)}>
        Nova cobrança
      </button>

      {mostrarFormulario && (
        <div className="modal">
          <h3>Nova Cobrança</h3>

          <input
            type="text"
            placeholder="Nome do Cliente"
            value={nome_cliente}
            onChange={(e) => setnome_cliente(e.target.value)}
          />

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setvalor(e.target.value)}
          />

          <input
            type="date"
            placeholder="Data de Vencimento"
            value={data_vencimento}
            onChange={(e) => setdata_vencimento(e.target.value)}
          />

          <select value={status} onChange={(e) => setstatus(e.target.value)}>
            <option value="">Selecione o Status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </select>

          <button onClick={salvarCobranca}>Salvar</button>
          <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
        </div>
      
      )}
    </div>
    </>
  );
}

export default App
