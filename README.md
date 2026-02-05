# Mini Sistema de Cobranças

Sistema simples para gerenciamento de cobranças, desenvolvido como teste técnico para vaga de estágio em desenvolvimento.

## 🎯 Objetivo

Criar uma aplicação full-stack minimalista que permita:
- Listar cobranças
- Criar novas cobranças
- Atualizar status de cobranças (PENDENTE → PAGO)

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MySQL (persistencia em banco de dados)
- CORS
- dotenv

### Frontend
- React.js
- CSS3
- Fetch API

## 🚀 Como Executar

### 1. Backend
```bash
cd backend
pnpm install
cp .env.example .env
pnpm dev
```
O backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

O frontend estará rodando em `http://localhost:5173`

## ⚙️ Configuração do Banco de Dados

### Passo 1: Criar o Banco e Tabelas

```bash
# Execute o script SQL para criar o banco e a tabela
mysql -u root -p < database/schema.sql

# Digite a senha quando solicitado
```

### Passo 2: Verificar se o banco foi criado
```sql
-- Entrar no MySQL
mysql -u root -p

-- Listar bancos
SHOW DATABASES;


-- Deve aparecer "debt_system"

-- Usar o banco
USE debt_system;

-- Ver tabelas
SHOW TABLES;

-- Deve aparecer "debts"

-- Ver estrutura
DESCRIBE debts;
```

Edite o arquivo `.env`:
```env
# Configure com suas credenciais
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=debt_system
```
**⚠️ IMPORTANTE:** Substitua `sua_senha_aqui` pela senha que você configurou!

## 📁 Estrutura do Projeto

### 1. Backend
```
src/
├── config/          # Configurações (banco de dados)
├── controllers/     # Controladores (recebem requisições)
├── middlewares/     # Middlewares (tratamento de erros)
├── models/          # Modelos de dados
├── repositories/    # Acesso aos dados
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── types/           # Definições de tipos e interfaces
├── utils/           # Utilitários
├── validators/      # Validações
├── app.ts           # Configuração do Express
└── server.ts        # Inicialização do servidor
```

### 2. Frontend
```
src/
├── components/        # Componentes React
│   ├── ui/            # Componentes de design padrão
│   ├── createDebt.tsx # Modal de criação de cobrança
│   ├── debtItem.tsx   # Item individual da lista de cobranças
│   ├── debtList.tsx   # Lista de cobranças
│   ├── footer.tsx     # Rodapé da página
│   ├── header.tsx     # Cabeçalho da página
│   └── loading.tsx    # Indicador de carregamento
├── services/          # Serviços de API
│   └── api.ts         # Cliente HTTP
├── utils/             # Utilitários
│   ├── debtValid.tsx  # Formatação que valida o campo do formulário
│   └── index.ts       # Formatação de dados
├── App.tsx            # Componente principal
├── index.css          # Estilos globais
└── main.tsx           # Entry point
```

## 📡 Endpoints da API
### Cobranças

#### Listar todas as cobranças
```
GET /api/cobrancas
Query params: ?status=PENDENTE ou ?status=PAGO
```

#### Buscar cobrança por ID
```
GET /api/cobrancas/:id
```

#### Criar nova cobrança
```
POST /api/cobrancas
Body: {
  "client_name": "João Silva",
  "amount": 150.00,
  "expire_date": "2026-02-15",
  "status": "PENDENTE"  // opcional
}
```

#### Atualizar status
```
PATCH /api/cobrancas/:id/status
Body: {
  "status": "PAGO"
}
```

#### Obter estatísticas
```
GET /api/cobrancas/estatisticas
```

## 📌 Requisitos Funcionais

### 🔧 Backend

Criar uma API que permita: 

- ✅ Listar cobranças
- ✅ Criar uma nova cobrança
- ✅ Atualizar o status de uma cobrança
- ✅ Campos mínimos de uma cobrança:
  - Nome do cliente
  - Valor
  - Data de vencimento
  - Status (`PENDENTE` ou `PAGO`)

---

### 🎨 Frontend

Criar uma interface simples que permita:

- ✅ Visualizar a lista de cobranças
- ✅ Criar uma nova cobrança
- ✅ Alterar o status de uma cobrança para `PAGO`

📎 Observações:
- O layout pode ser simples
- O foco é funcionalidade, organização e clareza
- Utilize componentes e estado de forma básica

---

## 🧩 Requisitos Não Funcionais

- ✅ Código organizado e legível
- ✅ Nomes claros para variáveis, funções e arquivos
- ✅ Separação mínima de responsabilidades
- ✅ README explicando como rodar o projeto

---

## ⭐ Funcionalidades Bônus Implementadas

- ❌ Testes unitários básicos (backend e/ou frontend)
- ✅ Persistência com MySQL
- ✅ Arquitetura em camadas (Controller, Service, Repository)
- ✅ Tratamento de erros com mensagens claras
- ✅ Estados de loading no frontend
- ✅ Commits bem descritos
- ✅ Comentários explicando decisões técnicas importantes
- ✅ Ordenação por data de vencimento

## 👨‍💻 Autor

Amós Barbato

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte de um teste técnico.


