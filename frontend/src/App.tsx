import { useEffect, useState } from 'react'
import './App.css'

export interface BillingModel {
  id: string
  clientName: string
  value: number
  dueDate: string
  status: "PENDENTE" | "PAGO"
}

function App() {
  const [billings, setBillings] = useState<BillingModel[]>([])
  useEffect(() => {
    fetch("http://localhost:3333/billings")
      .then(r => r.json())
      .then(setBillings)
      .catch(console.error)
  }, [])


  const [clientName, setClientName] = useState('')
  const [value, setValue] = useState<number | ''>('')
  const [dueDate, setDueDate] = useState('') // yyyy-mm-dd
  const [status, setStatus] = useState<"PENDENTE" | "PAGO">("PENDENTE")
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName || value === '' || !dueDate) return alert('Preencha todos os campos')

    const payload = {
      clientName,
      value: Number(value),
      dueDate: new Date(dueDate).toISOString(),
      status
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:3333/billings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const created = await res.json()


      setBillings(prev => [...prev, created])


      setClientName('')
      setValue('')
      setDueDate('')
      setStatus('PENDENTE')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.ChangeEvent<HTMLSelectElement>,id:string) {
    e.preventDefault()
    const status = e.currentTarget.value

    const payload = {
      status
    }

    try {
      const res = await fetch(`http://localhost:3333/billings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const updated = await res.json()


      setBillings(prev => prev.map((item) => {
        if (item.id === updated.id) {
          return updated
        }
        return item
      }))



    } catch (err) {
      console.error(err)
      alert('Erro ao salvar.')
    } 
  }

  return (
    <main className="app-container">
      <header>
        <h1>Sistema de cobrança</h1>
      </header>

      <section>
        <form onSubmit={handleAdd} className="add-form">
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome" />
          <input value={value} onChange={e => setValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Valor" type="number" min="0" step="0.01" />
          <input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" />
          <select value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="PENDENTE">PENDENTE</option>
            <option value="PAGO">PAGO</option>
          </select>
          <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Adicionar'}</button>
        </form>
      </section>

      <table>
        <thead>
          <tr>
            <th>Nome do cliente</th>
            <th>Valor</th>
            <th>Data de vencimento</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {billings.map((item) => {
            return <tr key={item.id}>
              <td>{item.clientName}</td>
              <td>{item.value}</td>
              <td>{new Date(item.dueDate).toLocaleDateString("pt-BR")}</td>
              <td>
                <select value={item.status} onChange={e => handleUpdate(e, item.id)}>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGO">PAGO</option>
                </select>
              </td>
            </tr>
          })}
        </tbody>

      </table>


    </main>
  )
}

export default App
