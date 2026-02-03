const express = require('express');
const cors = require('cors');
const cobrancasJson = require('./data/cobranca.json');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const cobrancas = [...cobrancasJson]; //copia do json

app.get('/', (req, res) => {
     res.send('api funcionando'); //mensagem se a api estiver online
});

app.get('/cobrancas', (req, res) => {
     res.json(cobrancas); //retorna as cobranças em json
});

app.post('/cobrancas', (req, res) => {
     const { nome, valor, vencimento } = req.body; // desestruturando os campos do body

     if (!nome || !valor || !vencimento) {
          //verificando se os campos foram preenchidos
          return res.status(400).json({ error: 'Campos obrigatórios' });
     }

     const novaCobranca = {
          //criando uma nova cobrança
          id: Date.now(),
          nome,
          valor,
          vencimento,
          status: 'PENDENTE',
     };

     cobrancas.push(novaCobranca); //adicionando a nova cobrança ao array
     res.status(201).json(novaCobranca);
});

app.patch('/cobrancas/:id', (req, res) => {
     // atualizando o status da cobrança
     const id = Number(req.params.id); // pegando o id da cobrança
     const cobranca = cobrancas.find(c => c.id === id); // procura a cobrança pelo id no array

     if (!cobranca) {
          return res.status(404).json({ error: 'Cobrança não encontrada' });
     }

     if (req.body && req.body.status) {
          cobranca.status = req.body.status;
     } else {
          cobranca.status = cobranca.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
     }
     res.json(cobranca);
});

app.listen(PORT, () => {
     // rodando o servidor
     console.log(`Servidor rodando na porta ${PORT}`);
});
