# Teste Tecnico - Mini Sistema de Cobrancas

Projeto com backend e frontend para gerenciar cobrancas.

## Tecnologias

- Backend: Node.js + Express
- Frontend: React + Vite
- Persistencia: em memoria (sem banco)

## Estrutura

- `backend`: API REST
- `frontend`: interface web

## Requisitos

- Node.js 20+
- npm 10+

## Como rodar

1. Backend

```bash
cd backend
npm install
npm run dev
```

API em: `http://localhost:3001`

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App em: `http://localhost:5173`

## Endpoints da API

### `GET /cobrancas`
Lista todas as cobrancas.

Resposta:

```json
[
  {
    "id": 1,
    "nomeCliente": "Maria",
    "valor": 150.75,
    "dataVencimento": "2026-03-10",
    "status": "PENDENTE"
  }
]
```

### `POST /cobrancas`
Cria uma cobranca.

Body:

```json
{
  "nomeCliente": "Maria",
  "valor": 150.75,
  "dataVencimento": "2026-03-10"
}
```

### `PATCH /cobrancas/:id/status`
Atualiza o status para `PAGO`.

## Regras implementadas

- Campos obrigatorios: `nomeCliente`, `valor`, `dataVencimento`
- `valor` deve ser numero maior que zero
- `dataVencimento` deve ser data valida
- `status` inicia como `PENDENTE`

## Funcionalidades do frontend

- Listagem de cobrancas
- Criacao de cobranca
- Atualizacao de status para `PAGO`
- Estado de loading e mensagens de erro

## Organizacao de codigo

Backend em camadas:

- `routes`
- `controllers`
- `services`
- `repositories`

Frontend com componentes:

- `CobrancaForm`
- `CobrancaList`
- `services/api.js`

## Observacoes

- Os dados ficam em memoria e sao reiniciados quando o backend reinicia.
- Nao ha autenticacao, deploy ou estilização avancada por escopo do desafio.
