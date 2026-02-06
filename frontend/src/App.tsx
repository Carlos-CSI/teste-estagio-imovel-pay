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
  useEffect(()=>{
    fetch("http://localhost:3333/billings").then((result)=>{
      return result.json()
    }).then((result)=>{
      setBillings(result)
    })
  }, [])

  return (
    <div>
      <h1>Sistema de Cobranças</h1>
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
              <td>{item.dueDate}</td>
              <td>{item.status}</td>
            </tr>
          })}
        </tbody>

      </table>
    </div>
  )
}

export default App
