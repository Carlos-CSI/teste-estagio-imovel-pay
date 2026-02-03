import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // Estados para armazenar os dados
  const [cobrancas, setCobrancas] = useState([])

  // Estados do formulário
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')

  // URL da sua API Java
  const API_URL = 'http://localhost:8080/cobrancas'

  // 1. Carregar cobranças ao abrir a tela
  useEffect(() => {
    carregarCobrancas()
  }, [])

  const carregarCobrancas = async () => {
    try {
      const response = await axios.get(API_URL)
      setCobrancas(response.data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      alert("Erro ao conectar com o Backend. O Java está rodando?")
    }
  }

  // 2. Criar nova cobrança
  const salvarCobranca = async (e) => {
    e.preventDefault() // Evita recarregar a página
    try {
      await axios.post(API_URL, {
        nomeCliente: nome,
        valor: parseFloat(valor), // Converte texto para número
        dataVencimento: data
      })
      alert("Cobrança criada!")
      // Limpa formulário e recarrega lista
      setNome('')
      setValor('')
      setData('')
      carregarCobrancas()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar. Verifique os dados.")
    }
  }

  // 3. Atualizar status para PAGO
  const marcarComoPago = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: 'PAGO' })
      carregarCobrancas() // Atualiza a lista para mostrar o novo status
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Sistema de Cobranças</h1>

      {/* Formulário de Cadastro */}
      <div className="card p-4 mb-5 shadow-sm">
        <h4>Nova Cobrança</h4>
        <form onSubmit={salvarCobranca} className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Nome do Cliente"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Valor (R$)"
              value={valor}
              onChange={e => setValor(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={data}
              onChange={e => setData(e.target.value)}
              required
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">+</button>
          </div>
        </form>
      </div>

      {/* Lista de Cobranças */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cobrancas.map(cobranca => (
            <tr key={cobranca.id}>
              <td>{cobranca.nomeCliente}</td>
              <td>R$ {cobranca.valor.toFixed(2)}</td>
              {/* Formatação simples da data */}
              <td>{new Date(cobranca.dataVencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
              <td>
                <span className={`badge ${cobranca.status === 'PAGO' ? 'text-bg-success' : 'text-bg-warning'}`}>
                  {cobranca.status}
                </span>
              </td>
              <td>
                {cobranca.status === 'PENDENTE' && (
                  <button
                    onClick={() => marcarComoPago(cobranca.id)}
                    className="btn btn-sm btn-success"
                  >
                    Pagar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App