# Sistema de Cobranças (Imovel Pay)

Aplicação simples para listar, criar e atualizar cobranças. O frontend é feito em React + TypeScript (Vite) e o backend é uma API Express com dados locais em JSON.

## Funcionalidades

- Listar cobranças.
- Criar nova cobrança.
- Atualizar status da cobrança (PAGO/PENDENTE).

## Tecnologias

- Frontend: React, TypeScript, Vite, Styled Components.
- Backend: Node.js, Express, CORS.

## Como rodar o projeto

### 1) Instalar dependências

```bash
npm install
```

### 2) Iniciar o backend (API)

```bash
node backend/server.js
```

A API sobe em `http://localhost:3000`.

### 3) Iniciar o frontend

```bash
npm run dev
```

O frontend sobe no endereço indicado pelo Vite (geralmente `http://localhost:5173`).

## Como usar

1. Clique em **Listar cobranças** para ver todas as cobranças.
2. Clique em **Criar nova cobrança** para preencher o formulário e criar.
3. Clique em **Atualizar status de cobrança** para alternar entre **PAGO** e **PENDENTE**.

## Estrutura do projeto

- `frontend/`: aplicação React.
- `backend/`: API Express.
- `backend/data/cobranca.json`: dados iniciais das cobranças.

## Observações

- O status é atualizado via `PATCH /cobrancas/:id`.
- Os dados ficam em memória enquanto o servidor está rodando. Reiniciar o backend volta para o JSON inicial.
