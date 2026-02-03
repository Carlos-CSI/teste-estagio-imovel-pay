import {
     Container,
     GlobalStyle,
     Title,
     Button,
     Menu,
     Content,
     ContentItem,
     Input,
     Card,
} from './styleGlobal';
import { useEffect, useState } from 'react';

type Cobranca = {
     //formato que vem do back
     id: number;
     nome: string;
     valor: number;
     vencimento: string;
     status: 'PAGO' | 'PENDENTE';
};

function App() {
     const [cobrancas, setCobrancas] = useState<Cobranca[]>([]); //array de cobranças
     const [view, setView] = useState<'list' | 'create' | 'update'>('list'); //controla qual tela é exibida
     const [form, setForm] = useState({
          nome: '',
          valor: '',
          vencimento: '',
     }); // estado do formulario para criar uma nova cobrança
     const [loading, setLoading] = useState(false); // apenas um feedback visual
     const [error, setError] = useState<string | null>(null); // estado para armazenar erros

     useEffect(() => {
          setLoading(true);
          setError(null);
          fetch('http://localhost:3000/cobrancas')
               .then(res => res.json())
               .then(data => setCobrancas(data))
               .catch(() => setError('Erro ao carregar cobranças.'))
               .finally(() => setLoading(false));
     }, []); //conecta o frontend ao backend chamando a api

     const handleCreate = async () => {
          //função para criar uma nova cobrança
          if (!form.nome || !form.valor || !form.vencimento) {
               setError('Preencha nome, valor e vencimento.');
               return;
          } // verificando se os campos foram preenchidos

          setLoading(true);
          setError(null);
          try {
               const res = await fetch('http://localhost:3000/cobrancas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                         nome: form.nome,
                         valor: Number(form.valor),
                         vencimento: form.vencimento,
                    }),
               }); // tentando criando uma nova cobrança

               if (!res.ok) {
                    throw new Error('Falha ao criar cobrança.');
               }

               const nova = await res.json(); //pegando a nova cobrança criada
               setCobrancas(prev => [nova, ...prev]); //adicionando a nova cobrança ao array
               setForm({ nome: '', valor: '', vencimento: '' }); // limpando o formulario
               setView('list'); // voltando para a tela de listagem
          } catch {
               setError('Erro ao criar cobrança.'); // caso de erro
          } finally {
               setLoading(false);
          }
     };

     const handleUpdateStatus = async (id: number, status: Cobranca['status']) => {
          // função para atualizar o status de uma cobrança
          setLoading(true);
          setError(null);
          try {
               const res = await fetch(`http://localhost:3000/cobrancas/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
               }); // tentando atualizar o status

               if (!res.ok) {
                    throw new Error('Falha ao atualizar cobrança.');
               }

               const updated = await res.json(); // pegando a cobrança atualizada
               setCobrancas(prev => prev.map(c => (c.id === id ? updated : c))); // atualizando o array
          } catch {
               setError('Erro ao atualizar cobrança.');
          } finally {
               setLoading(false);
          }
     };

     return (
          <Container>
               <GlobalStyle />

               <Title>Sistema de cobrança</Title>

               <Menu>
                    <Button onClick={() => setView('list')}>Listar cobranças</Button>
                    <Button onClick={() => setView('create')}>Criar nova cobrança</Button>
                    <Button onClick={() => setView('update')}>Atualizar status de cobrança</Button>
               </Menu>

               <Content>
                    <h1>
                         {view === 'list'
                              ? 'Listagem de cobranças'
                              : view === 'create'
                                ? 'Criar nova cobrança'
                                : 'Atualizar status de cobrança'}
                    </h1>{' '}
                    {/* texto que indica qual tela é exibida */}
                    {error && <p>{error}</p>}
                    {loading && <p>Carregando...</p>}
                    {view === 'list' &&
                         // exibindo as cobranças
                         cobrancas.map(cobranca => (
                              <ContentItem key={cobranca.id}>
                                   <p>Nome: {cobranca.nome}</p>
                                   <p>Valor: {cobranca.valor}</p>
                                   <p>Vencimento: {cobranca.vencimento}</p>
                                   <Card status={cobranca.status}>Status: {cobranca.status}</Card>
                              </ContentItem>
                         ))}{' '}
                    {view === 'update' &&
                         //atualizando o status
                         cobrancas.map(cobranca => {
                              const nextStatus = cobranca.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
                              return (
                                   <ContentItem key={cobranca.id}>
                                        <p>Nome: {cobranca.nome}</p>
                                        <p>Valor: {cobranca.valor}</p>
                                        <p>Vencimento: {cobranca.vencimento}</p>
                                        <p>Status: {cobranca.status}</p>
                                        <Button
                                             type="button"
                                             onClick={() =>
                                                  handleUpdateStatus(cobranca.id, nextStatus)
                                             } // quando a pessoa clica chama a função e passa o id e o status
                                             disabled={loading}
                                        >
                                             {nextStatus === 'PAGO'
                                                  ? 'Marcar como pago'
                                                  : 'Marcar como pendente'}{' '}
                                             {/* se o status for pago, mostra "Marcar como pago", se for pendente, mostra "Marcar como pendente" */}
                                        </Button>
                                   </ContentItem>
                              );
                         })}{' '}
                    {view === 'create' && (
                         // criando uma nova cobrança
                         <ContentItem as="form">
                              <label>
                                   Nome
                                   <Input
                                        type="text"
                                        value={form.nome}
                                        onChange={e => setForm({ ...form, nome: e.target.value })}
                                   />
                              </label>
                              <label>
                                   Valor
                                   <Input
                                        type="number"
                                        value={form.valor}
                                        onChange={e => setForm({ ...form, valor: e.target.value })}
                                   />
                              </label>
                              <label>
                                   Vencimento
                                   <Input
                                        type="date"
                                        value={form.vencimento}
                                        onChange={e =>
                                             setForm({ ...form, vencimento: e.target.value })
                                        }
                                   />
                              </label>
                              {/* ao preencher os campos o stage form muda e quando o botão for clicado chama a funcao que cria de acordo com o stage do form */}
                              <Button type="button" onClick={handleCreate} disabled={loading}>
                                   Criar cobrança
                              </Button>
                         </ContentItem>
                    )}
               </Content>
          </Container>
     );
}

export default App;
