import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CobrancasList } from '../components/CobrancasList';

export function Home() {
  const [cobrancas, setCobrancas] = useState([]);
  const [form, setForm] = useState({
    nomeCliente: '',
    valor: '',
    dataRegularizacao: ''
  });

  async function carregar() {
    const { data } = await api.get('/cobrancas');
    setCobrancas(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar() {
    await api.post('/cobrancas', form);
    setForm({ nomeCliente: '', valor: '', dataRegularizacao: '' });
    carregar();
  }

  async function pagar(id) {
    await api.put(`/cobrancas/${id}/pagar`);
    carregar();
  }

  return (
    <div>
      <h1>Mini Sistema de Cobranças</h1>

      <input placeholder="Cliente" onChange={e => setForm({ ...form, nomeCliente: e.target.value })} />
      <input placeholder="Valor" onChange={e => setForm({ ...form, valor: e.target.value })} />
      <input type="date" onChange={e => setForm({ ...form, dataRegularizacao: e.target.value })} />
      <button onClick={criar}>Criar</button>

      <CobrancasList cobrancas={cobrancas} onPagar={pagar} />
    </div>
  );
}