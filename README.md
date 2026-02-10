# 💳 Mini Sistema de Cobranças

Sistema simples de gerenciamento de cobranças, com **backend em Node.js (Express)** e **frontend web**, permitindo criar cobranças e marcar como **Pagas ou Pendentes**.

Projeto desenvolvido como estudo/prática de **CRUD básico + integração Front-end ↔ Back-end**.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express
- fs (File System)
- JSON como base de dados

### Frontend
- HTML
- CSS
- JavaScript (Fetch API)

---

## 📂 Estrutura do Projeto

📦 projeto
┣ 📂 backend
┃ ┣ 📂 data
┃ ┃ ┗ 📜 cobrancas.json
┃ ┣ 📂 routes
┃ ┃ ┗ 📜 cobrancas.routes.js
┃ ┣ 📂 services
┃ ┃ ┗ 📜 cobrancas.service.js
┃ ┣ 📜 app.js
┃ ┗ 📜 server.js
┣ 📂 frontend
┃ ┣ 📜 index.html
┃ ┣ 📜 style.css
┃ ┗ 📜 script.js
┣ 📜 package.json
┗ 📜 README.md


---

## 🚀 Funcionalidades

- 📄 Listar cobranças
- ➕ Criar nova cobrança
- 🔄 Atualizar status da cobrança
- ✅ Marcar cobrança como **Paga**
- 💾 Persistência de dados em arquivo JSON

---

## ⚙️ Como Executar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone <url-do-repositorio>
2️⃣ Entrar na pasta do backend
cd backend
3️⃣ Instalar as dependências
npm install
4️⃣ Iniciar o servidor
npm start
Servidor rodando em:

http://localhost:3001
🌐 Endpoints da API
➤ Listar cobranças
GET /cobrancas
➤ Criar cobrança
POST /cobrancas
Body (JSON):

{
  "cliente": "Maria Silva",
  "valor": 150,
  "data": "2026-02-01"
}
➤ Atualizar status da cobrança
PUT /cobrancas/:id
Body (JSON):

{
  "status": "Pago"
}
🖥️ Frontend
O frontend consome a API usando Fetch API, permitindo:

Visualizar cobranças

Criar novas cobranças

Marcar cobranças como pagas com um clique

📌 Observações

Dados armazenados localmente em cobrancas.json

Ideal para demonstrar:

Lógica de backend

Integração front-end/back-end

Conceitos básicos de API REST

👩‍💻 Autora
Letícia Coelho
