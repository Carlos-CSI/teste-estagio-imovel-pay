# Teste de Estágio — Imovel Pay

Sistema de gerenciamento de cobranças com backend em NestJS e frontend em React. Permite cadastrar clientes, criar cobranças, registrar pagamentos e acompanhar o status financeiro por meio de um dashboard. O enunciado original do desafio está disponível em [contextoTeste.md](contextoTeste.md).

---

## Estrutura do Projeto

```
.
├── backend/          # API REST em NestJS + Prisma
├── frontend/         # React + Vite + Tailwind
├── docker-compose.yml
└── .env              # Variáveis de ambiente da raiz (usadas pelo docker-compose)
```

---

## Como Rodar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js 20+](https://nodejs.org/) (para rodar localmente sem Docker)

---

### Opção 1 — Tudo via Docker Compose

```bash
# Na raiz do projeto
cp .env.example .env   # ajuste as variáveis se necessário
docker compose up --build
```

Serviços disponíveis:

| Serviço   | URL                    |
|-----------|------------------------|
| Frontend  | http://localhost:5173  |
| Backend   | http://localhost:3000  |
| Swagger   | http://localhost:3000/api |
| Adminer   | http://localhost:8080  |

---

### Opção 2 — Localmente (sem Docker para a aplicação)

O banco de dados ainda precisa rodar via Docker:

```bash
# Na raiz do projeto — sobe apenas o MySQL
docker compose up db
```

**Backend:**

```bash
cd backend
npm install              # instala as dependências do projeto
npm run prisma:generate  # gera o Prisma Client com base no schema.prisma
npm run prisma:migrate   # cria as tabelas no banco de dados
npm run prisma:seed      # recomendado: popula dados iniciais para melhor visualização
npm run start:dev        # inicia o servidor em modo de desenvolvimento com hot reload
```

**Frontend:**

```bash
cd frontend
npm install   # instala as dependências do projeto
npm run dev   # inicia o servidor de desenvolvimento Vite
```

O [frontend/.env](frontend/.env) já aponta para `http://localhost:3000` por padrão.

---

## Variáveis de Ambiente

### Raiz do projeto (`.env`) — usada pelo Docker Compose

```env
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=cobranca_db
MYSQL_USER=root
MYSQL_PASSWORD=root_password
DB_PORT=3306
BACKEND_PORT=3000
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000
```

### Backend (`backend/.env`) — usada ao rodar localmente

```env
DATABASE_URL="mysql://root:root_password@localhost:3306/cobranca_db"
PORT=3000
```

### Frontend (`frontend/.env`) — usada ao rodar localmente com Vite

```env
VITE_API_URL=http://localhost:3000
```

> **Como funciona a prioridade:**
> No Docker, o `VITE_API_URL` é passado como `build arg` pelo docker-compose para o Dockerfile do frontend e embutido no bundle pelo Vite em tempo de build. O `.env` local é útil apenas ao rodar `npm run dev` fora do Docker.

---

## Backend

> Para mais detalhes sobre a arquitetura, endpoints, testes e decisões técnicas do backend, consulte o [backend/README.md](backend/README.md).

### Tecnologias

- **NestJS** — framework Node.js baseado em módulos, injeção de dependência e decorators. Facilita a organização do código em camadas (controller, service, module) e a separação de responsabilidades.
- **Prisma** — ORM type-safe que abstrai as queries SQL e gera os tipos TypeScript automaticamente a partir do [schema.prisma](backend/prisma/schema.prisma). Evita SQL manual, garante segurança de tipos e simplifica migrações.
- **MySQL 8** — banco relacional, adequado para dados financeiros que exigem transações ACID.
- **Swagger** — documentação interativa da API gerada automaticamente por meio dos decorators do NestJS (`@ApiProperty`, `@ApiOperation`, etc.), acessível em `/api`. Permite testar os endpoints sem ferramentas externas.

### Módulos

| Módulo        | Responsabilidade                                              |
|---------------|---------------------------------------------------------------|
| `customers`   | CRUD de clientes, listagem com ordenação e filtros           |
| `charges`     | CRUD de cobranças, paginação, filtro por status, cálculo de juros |
| `payments`    | Registro de pagamentos com validação de valor e transação DB |

### Modelagem do Banco de Dados — Normalização

O enunciado do teste sugeria uma única entidade de cobrança com os campos: nome do cliente, valor, data de vencimento e status. Optou-se por normalizar o modelo em **três tabelas** relacionadas:

```
Customer (1) ──< Charge (1) ──< Payment (0..1)
```

| Tabela     | Dados armazenados                                          |
|------------|------------------------------------------------------------|
| `Customer` | Dados do cliente (nome, CPF)                              |
| `Charge`   | Dados da cobrança (valor, vencimento, status)             |
| `Payment`  | Dados do pagamento (valor pago, data, método)             |

**Benefícios da normalização:**

- **Sem redundância** — o nome e CPF do cliente são armazenados uma única vez, independentemente de quantas cobranças ele tiver. Na abordagem desnormalizada, esses dados se repetiriam em cada linha.
- **Integridade referencial** — a chave estrangeira `customerId` em `Charge` garante que não exista uma cobrança órfã, sem cliente. O Prisma aplica `onDelete: Cascade` para manter consistência ao remover um cliente.
- **Rastreabilidade do pagamento** — separar `Payment` de `Charge` permite registrar *quando* e *como* o pagamento foi feito (método, data, valor exato com juros) sem poluir a entidade de cobrança. Uma relação `1:1` única por cobrança ainda impede pagamentos duplicados via constraint no banco.
- **Escalabilidade** — adicionar novos dados ao cliente (endereço, e-mail, telefone) ou ao pagamento (comprovante, gateway) não exige alterar a tabela de cobranças.

### Status de uma Cobrança

Uma cobrança pode assumir quatro estados:

| Status      | Descrição                                                   |
|-------------|-------------------------------------------------------------|
| `PENDENTE`  | Criada, dentro do prazo, aguardando pagamento               |
| `PAGO`      | Pagamento registrado com sucesso                            |
| `VENCIDO`   | Data de vencimento ultrapassada e ainda sem pagamento       |
| `CANCELADO` | Cancelada manualmente, sem possibilidade de pagamento       |

Esses estados foram modelados como `enum` no Prisma e refletem o ciclo de vida real de uma cobrança financeira. Ter `VENCIDO` como estado explícito permite filtrar e exibir cobranças em atraso sem depender de cálculos na camada de apresentação.

### Cálculo de Juros para Cobranças Vencidas

Cobranças com status `VENCIDO` acumulam juros proporcionais ao tempo em atraso:

$$\text{juros} = \text{valor original} \times 0{,}10 \times \frac{\text{dias em atraso}}{30}$$

A taxa é de **10% ao mês**, calculada proporcionalmente por dia. O cálculo é feito em [`interest-calculator.ts`](backend/src/commons/utils/interest-calculator.ts) e aplicado tanto na exibição da cobrança quanto na validação do valor do pagamento — o sistema rejeita um pagamento cujo valor não corresponda ao total com juros (tolerância de R$ 0,01 para arredondamentos).

### DTOs e Validação

**DTOs (Data Transfer Objects)** são classes que definem a forma esperada dos dados de entrada. Usam os decorators do `class-validator` para garantir que os dados cheguem corretos antes de tocar qualquer regra de negócio ou banco de dados.

Exemplos de validações aplicadas:

- `amount`: número positivo, mínimo R$ 0,01
- `dueDate`: deve ser uma data presente ou futura, com no máximo 1 ano a partir da criação (validators customizados: `@IsFutureDate`, `@IsWithinOneYear`)
- `cpf`: formato de 11 dígitos + validação pelo algoritmo (ver abaixo)

### Validação de CPF

A validação do CPF ocorre em duas etapas:

1. **Formato** — expressão regular garante 11 dígitos numéricos (`@Matches(/^\d{11}$/)`). O DTO ainda faz um `@Transform` para remover pontos e hífen antes de validar, aceitando tanto `12345678900` quanto `123.456.789-00`.

2. **Algoritmo** — o decorator customizado `@IsCpf` implementado em [`is-cpf.validator.ts`](backend/src/commons/validators/is-cpf.validator.ts) verifica os dois dígitos verificadores pela fórmula oficial da Receita Federal. Rejeita também sequências repetidas como `111.111.111-11`.

> **Importante:** a validação pelo algoritmo garante que o CPF é *matematicamente* válido, mas **não** consulta a Receita Federal. Um CPF pode passar por todas essas verificações e ainda estar irregular (suspenso, cancelado ou pendente de regularização) — isso exigiria integração com serviços externos de bureau de crédito ou APIs governamentais, o que está fora do escopo deste projeto.

### Filtros e Ordenação

Tanto `/customers/:id` quanto `/charges` aceitam query params para filtrar e ordenar os resultados:

| Parâmetro | Descrição                                      |
|-----------|------------------------------------------------|
| `status`  | Filtra por status da cobrança                  |
| `orderBy` | Campo para ordenação (`dueDate`, `amount`, etc.) |
| `order`   | Direção da ordenação: `asc` ou `desc`          |
| `page`    | Número da página (paginação em `/charges`)     |
| `limit`   | Itens por página                               |

### Testes Unitários

Os testes utilizam **Jest** com **mocks** do `PrismaService`, isolando a lógica de negócio do banco de dados real. Cada service é testado de forma independente, garantindo que os comportamentos esperados (lançamento de exceções, transformações de dados, cálculos) funcionem corretamente sem dependências externas.

**Factories** em [`test/factories/`](backend/test/factories/) centralizam a criação de objetos de teste com valores padrão sensatos, permitindo criar variações com override pontual. Isso evita repetição nos testes e torna os dados de teste mais legíveis e manuteníveis.

```bash
cd backend
npm run test          # roda todos os testes
npm run test:cov      # com relatório de cobertura
```

---

## Frontend

> Para mais detalhes sobre a estrutura de componentes, páginas e decisões técnicas do frontend, consulte o [frontend/README.md](frontend/README.md).

### Tecnologias

- **React 19** com **TypeScript**
- **Vite** — bundler moderno com dev server extremamente rápido
- **Tailwind CSS** — utilitários CSS inline que eliminam a necessidade de arquivos de estilo separados
- **React Router** — roteamento client-side entre as páginas
- **Recharts** — biblioteca de gráficos para o dashboard
- **Axios** — cliente HTTP com instância centralizada em [`src/api/`](frontend/src/api/)

### Páginas

| Página             | Rota         | Descrição                                                                     |
|--------------------|--------------|-------------------------------------------------------------------------------|
| Dashboard          | `/`          | Visão geral: totais por status, gráficos de cobranças                        |
| Clientes           | `/customers` | Listagem de clientes com busca; detalhes do cliente abertos em modal         |
| Cobranças          | `/charges`   | Listagem global de cobranças com filtros e paginação                         |

### Dashboard

O dashboard apresenta métricas consolidadas sobre as cobranças:

- Total de cobranças por status (`PENDENTE`, `PAGO`, `VENCIDO`, `CANCELADO`)
- Valor total em aberto vs. recebido
- Gráficos de distribuição construídos com Recharts

### Listagem de Cobranças com Filtros

A página de cobranças permite filtrar por status e ordenar por data de vencimento ou valor, com paginação no lado do servidor — os parâmetros são repassados diretamente para a API.

---

## Docker

### Dockerfile (Frontend)

O build do frontend usa **multi-stage build**:

1. **Stage `builder`** — instala dependências e executa `npm run build`. Recebe `VITE_API_URL` como `ARG` e o exporta como `ENV` para que o Vite o inclua no bundle estático.
2. **Stage de produção** — copia apenas o conteúdo de `/dist` para uma imagem `nginx:alpine` leve, servindo os arquivos estáticos.

Esse padrão garante que a imagem final não contenha Node.js, código-fonte nem dependências de desenvolvimento.

### Dockerfile (Backend)

O backend compila o TypeScript e executa o binário compilado em produção, sem o compilador instalado na imagem final.

### Docker Compose

O `docker-compose.yml` na raiz orquestra todos os serviços. O arquivo `.env` na raiz é lido automaticamente pelo Compose e suas variáveis são interpoladas nos campos `environment:` e `args:` de cada serviço. Dessa forma, **um único `.env`** controla toda a configuração do ambiente Docker.

---

**Desenvolvido por:** [Christian Volz](https://github.com/christianbvolz)
