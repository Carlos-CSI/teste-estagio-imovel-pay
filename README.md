# 💳 Mini Sistema de Cobranças

O sistema permite gerenciar cobranças de forma simples, contendo backend e frontend separados, seguindo os requisitos propostos no desafio.

---

## ✅ Funcionalidades

- Listar cobranças cadastradas
- Criar uma nova cobrança
- Atualizar status da cobrança (PENDENTE || PAGO)
- Deletar uma cobrança

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- React
- Vite
- CSS

### Back-end

- Node.js
- Express
- Prisma ORM
- MongoDB(Banco de dados)

---

## 📂 Estrutura do Projeto

MINI-SISTEMA-DE-COBRANCAS
│
├── Back-end
├── Front-end
└── README.md

---

## ▶️ Como rodar o projeto

É necessário que o servidor do Front-end e do Back-end estejam rodando simultaneamente.

Abra dois terminais na raiz do projeto.

### 🔹 Terminal 1 — Front-end

cd Front-end
npm run dev

### 🔹 Terminal 2 — Back-end

cd Back-end
node --watch server.js

---

## 🧠 Funcionamento da aplicação

- Ao carregar a página, o Front-end realiza uma requisição `GET /cobranca` para buscar todas as cobranças.
- Ao criar uma nova cobrança, o sistema envia `POST /cobranca`.
- Ao alterar o status, é enviado `PATCH /cobranca/:id`.
- Ao deletar, é enviado `DELETE /cobranca/:id`.
- Após cada operação (criar, atualizar ou deletar), a lista é atualizada com um novo `GET` ao final da função.

Toda cobrança criada inicia com status **PENDENTE**.

---

## 📌 Validações implementadas

- Nome com mínimo de 3 caracteres
- Valor maior que zero
- Data obrigatória

---

## 📌 Decisões Técnicas

- Utilização de Node.js e Express para construção da API.
- Persistência de dados com MongoDB utilizando Prisma ORM.
- Separação clara entre backend e frontend.
- Atualização da listagem após cada operação para garantir sincronização com o banco.

---

## 👨‍💻 Autor

Ricardo Matheus  
Estudante de Engenharia de software
