# API de Gestão de Cobranças e Pagamentos

API RESTful desenvolvida com NestJS para gerenciamento completo de clientes, cobranças e pagamentos, com validação de CPF, enum de métodos de pagamento, regras de domínio (sem pagamentos parciais), testes unitários abrangentes e documentação Swagger interativa.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração](#️-configuração)
- [Como Rodar](#-como-rodar)
- [Testes](#-testes)
- [Documentação da API](#-documentação-da-api)
- [Validações e DTOs](#-validações-e-dtos)
- [Arquitetura e Boas Práticas](#-arquitetura-e-boas-práticas)

## 🚀 Tecnologias

### Core
- **[NestJS](https://nestjs.com/)** v9.4.3 - Framework Node.js para construção de aplicações server-side escaláveis
- **[TypeScript](https://www.typescriptlang.org/)** v4.0.0 - Superset tipado do JavaScript
- **[Prisma](https://www.prisma.io/)** v4.0.0 - ORM moderno para Node.js e TypeScript
- **[MySQL](https://www.mysql.com/)** - Sistema de gerenciamento de banco de dados relacional

### Validação e Transformação
- **[class-validator](https://github.com/typestack/class-validator)** v0.14.3 - Validação declarativa baseada em decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** v0.5.1 - Transformação de objetos plain para instâncias tipadas
- Validador customizado de CPF com verificação de dígitos verificadores
- Validação de enum para métodos de pagamento (PIX, CREDIT_CARD, DEBIT_CARD, BOLETO, BANK_TRANSFER)

### Documentação
- **[Swagger/OpenAPI](https://swagger.io/)** via `@nestjs/swagger` v6.3.0 - Documentação interativa da API

### Qualidade de Código
- **[ESLint](https://eslint.org/)** v8.0.0 - Linter para identificar e corrigir problemas de código
- **[@typescript-eslint](https://typescript-eslint.io/)** v5.0.0 - Plugin ESLint para TypeScript
- **[Prettier](https://prettier.io/)** v2.0.0 - Formatador de código opinativo
- **[Husky](https://typicode.github.io/husky/)** v8.0.0 - Git hooks para automação
- **[lint-staged](https://github.com/okonet/lint-staged)** v13.0.0 - Executa linters apenas em arquivos staged

### Testes
- **[Jest](https://jestjs.io/)** - Framework de testes JavaScript
- **[@nestjs/testing](https://docs.nestjs.com/fundamentals/testing)** v9.0.0 - Utilitários de teste do NestJS
- **[jest-mock-extended](https://github.com/marchaos/jest-mock-extended)** - Mocks tipados e type-safe
- **[ts-jest](https://github.com/kulshekhar/ts-jest)** - Preset TypeScript para Jest
- **Factories Pattern** - Geração de dados de teste reutilizáveis


## ✨ Funcionalidades

### Gestão de Clientes (Customers)
- ✅ **Listar todos os clientes** - `GET /customers` (ordenação alfabética por nome)
- ✅ **Buscar cliente por ID** - `GET /customers/:id` (inclui charges relacionadas)
- ✅ **Criar novo cliente** - `POST /customers` (com validação de CPF)
- ✅ **Atualizar nome do cliente** - `PATCH /customers/:id`
- ✅ **Remover cliente** - `DELETE /customers/:id` (cascade delete para charges e payments)

### Gestão de Cobranças (Charges)
- ✅ **Listar todas as cobranças** - `GET /charges` (paginação, filtro por status, inclui customer e payment)
- ✅ **Buscar cobrança por ID** - `GET /charges/:id` (inclui customer e payment relacionados)
- ✅ **Criar nova cobrança** - `POST /charges` (com validação de customer existente)
- ✅ **Atualizar cobrança** - `PATCH /charges/:id` (atualiza amount, dueDate ou status)
- ✅ **Remover cobrança** - `DELETE /charges/:id` (cascade delete para payment relacionado)
- ✅ **Filtros e paginação**: Query params para `status`, `page` e `limit`

### Gestão de Pagamentos (Payments)
- ✅ **Listar todos os pagamentos** - `GET /payments` (ordenação por data de pagamento descendente)
- ✅ **Buscar pagamento por ID** - `GET /payments/:id` (inclui charge e customer relacionados)
- ✅ **Criar novo pagamento** - `POST /payments` (atualiza status da charge atomicamente via transação)
- ✅ **Remover pagamento** - `DELETE /payments/:id`
- ✅ **Validação de método de pagamento**: Enum `PaymentMethod` (PIX, CREDIT_CARD, DEBIT_CARD, BOLETO, BANK_TRANSFER)
- ✅ **Regras de domínio**: Rejeita pagamentos parciais; apenas um pagamento por cobrança

### Validações Implementadas
- **CPF**: Validação de formato (11 dígitos) + algoritmo de dígitos verificadores
- **Unicidade**: Restrição de CPF único no banco de dados; um pagamento por cobrança (unique `chargeId`)
- **Integridade referencial**: Relacionamentos com cascade delete (Customer → Charges → Payment)
- **Enums tipados**: `ChargeStatus` (PENDENTE, PAGO, CANCELADO, VENCIDO) e `PaymentMethod`
- **Tipos de entrada**: ParseIntPipe para IDs, whitelist para DTOs, validação de valores positivos
- **Transações atômicas**: Criação de pagamento + atualização de cobrança ocorrem em transação Prisma
- **Tratamento de concorrência**: Mapeia erro Prisma P2002 (unique constraint) para BadRequestException

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── main.ts                          # Bootstrap da aplicação (ValidationPipe global, Swagger, filtros)
│   ├── app.module.ts                    # Módulo raiz (importa customers, charges, payments modules)
│   ├── customers/                       # Módulo de clientes
│   │   ├── customers.controller.ts          # Rotas HTTP
│   │   ├── customers.controller.spec.ts     # Testes do controller (10 testes)
│   │   ├── customers.service.ts             # Lógica de negócio
│   │   ├── customers.service.spec.ts        # Testes do service (10 testes)
│   │   ├── customers.module.ts              # Definição do módulo
│   │   ├── dto/                             # Data Transfer Objects
│   │   │   ├── create-customer.dto.ts
│   │   │   └── update-customer.dto.ts
│   │   └── interfaces/
│   │       └── customer-response.interface.ts # Tipos de resposta
│   ├── charges/                         # Módulo de cobranças
│   │   ├── charges.controller.ts            # Rotas HTTP (CRUD + filtros)
│   │   ├── charges.controller.spec.ts       # Testes do controller (12 testes)
│   │   ├── charges.service.ts               # Lógica de negócio (paginação, filtros)
│   │   ├── charges.service.spec.ts          # Testes do service (13 testes)
│   │   ├── charges.module.ts                # Definição do módulo
│   │   ├── dto/
│   │   │   ├── create-charge.dto.ts
│   │   │   ├── update-charge.dto.ts
│   │   │   └── query-charges.dto.ts         # DTOs para paginação e filtros
│   │   └── interfaces/
│   │       └── charge-response.interface.ts # Tipos de resposta
│   ├── payments/                        # Módulo de pagamentos
│   │   ├── payments.controller.ts           # Rotas HTTP
│   │   ├── payments.controller.spec.ts      # Testes do controller (6 testes)
│   │   ├── payments.service.ts              # Lógica de negócio (transações, regras de domínio)
│   │   ├── payments.service.spec.ts         # Testes do service (7 testes)
│   │   ├── payments.module.ts               # Definição do módulo
│   │   ├── dto/
│   │   │   └── create-payment.dto.ts        # DTO com enum PaymentMethod
│   │   └── interfaces/
│   │       └── payment-response.interface.ts # Tipos de resposta
│   ├── commons/                         # Código compartilhado
│   │   └── validators/
│   │       └── is-cpf.validator.ts          # Validador customizado de CPF
│   ├── filters/                         # Exception filters
│   │   └── http-exception.filter.ts         # Tratamento consolidado de erros Prisma/HTTP
│   └── prisma/
│       └── prisma.service.ts                # Serviço Prisma singleton
├── prisma/
│   ├── schema.prisma                    # Schema do banco de dados (enums, relacionamentos)
│   └── seed.ts                          # Script de seed (20 customers, 500 charges, 147 payments)
├── test/
│   └── factories/                       # Factories para testes
│       ├── index.ts                         # Barrel de reexportação
│       ├── customers.factory.ts             # Factories de customers
│       ├── charges.factory.ts               # Factories de charges
│       └── payments.factory.ts              # Factories de payments
├── .husky/
│   └── pre-commit                       # Hook de pre-commit (lint-staged)
├── .eslintrc.js                         # Configuração ESLint + TypeScript
├── .prettierrc                          # Configuração Prettier
├── jest.config.js                       # Configuração do Jest
├── tsconfig.json                        # Configuração TypeScript
├── package.json                         # Dependências e scripts
├── Dockerfile                           # Imagem Docker da aplicação
└── .env                                # Variáveis de ambiente
```

## 📦 Pré-requisitos

- **Node.js** >= 16.x
- **npm** >= 8.x
- **MySQL** 8.0 (configurado e rodando)

Ou para containerização:
- **Docker** >= 20.x

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```env
# Porta da aplicação
PORT=3000

# String de conexão do Prisma (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
```


### 2. Instalação de Dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations do Prisma
npx prisma migrate dev

# (Opcional) Popular banco com dados de exemplo (20 customers, 500 charges, 147 payments)
npm run prisma:seed

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

## 🏃 Como Rodar

### Desenvolvimento Local

```bash
# Modo desenvolvimento com hot-reload
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:3000`

### Com Docker

O projeto inclui um `Dockerfile` para containerização da aplicação:

```bash
# Build da imagem
docker build -t backend-api .

# Executar container (certifique-se de que o MySQL está acessível)
docker run -p 3000:3000 --env-file .env backend-api
```

**Observação**: O container precisa ter acesso ao banco de dados MySQL. Configure a variável `DATABASE_URL` no `.env` apontando para o host correto (pode ser necessário usar `host.docker.internal` em vez de `localhost` ao rodar em container).



## 🧪 Testes

### Executar Testes Unitários

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Cobertura de código
npm run test:cov
```

### Estrutura de Testes

- **Unit Tests**: Co-localizados com o código (`*.spec.ts`)
- **Mocks**: Gerados com `jest-mock-extended` (type-safe)
- **Factories**: Geração dinâmica de dados de teste reutilizáveis (`test/factories/`)
- **Padrão AAA**: Arrange-Act-Assert claramente separados

**Exemplo de teste com factory**:
```typescript
import { makeCustomer, makeCreateCustomerDto } from '../../test/factories';

it('should create and return a new customer', async () => {
  // Arrange
  const dto = makeCreateCustomerDto({ cpf: '12345678900' });
  const customer = makeCustomer({ cpf: dto.cpf });
  service.create.mockResolvedValue(customer);

  // Act
  const result = await controller.create(dto);

  // Assert
  expect(result).toEqual(customer);
  expect(service.create).toHaveBeenCalledWith(dto);
});
```

### Cobertura Atual

- ✅ **CustomersService**: 100% (10 testes)
- ✅ **CustomersController**: 100% (10 testes)
- ✅ **ChargesService**: 100% (13 testes)
- ✅ **ChargesController**: 100% (12 testes)
- ✅ **PaymentsService**: 100% (7 testes)
- ✅ **PaymentsController**: 100% (6 testes)
- Total: **58 testes passando** (6 suites)

## 📖 Documentação da API

### Swagger UI

Acesse a documentação interativa em:
```
http://localhost:3000/api
```

A documentação Swagger é gerada automaticamente a partir dos decorators:
- `@ApiTags('customers')` - Agrupamento de rotas
- `@ApiOperation({ summary: '...' })` - Descrição da operação
- `@ApiResponse({ status: ..., description: '...' })` - Respostas possíveis

### Endpoints Principais

#### Customers
| Método | Endpoint          | Descrição                    | Status |
|--------|-------------------|------------------------------|--------|
| GET    | `/customers`      | Lista todos os clientes      | 200    |
| GET    | `/customers/:id`  | Busca cliente por ID         | 200    |
| POST   | `/customers`      | Cria novo cliente            | 201    |
| PATCH  | `/customers/:id`  | Atualiza nome do cliente     | 200    |
| DELETE | `/customers/:id`  | Remove cliente               | 204    |

#### Charges
| Método | Endpoint                    | Descrição                               | Status |
|--------|-----------------------------|-----------------------------------------|--------|
| GET    | `/charges?status=PAGO&page=1&limit=10` | Lista cobranças (filtro + paginação) | 200 |
| GET    | `/charges/:id`              | Busca cobrança por ID                   | 200    |
| POST   | `/charges`                  | Cria nova cobrança                      | 201    |
| PATCH  | `/charges/:id`              | Atualiza cobrança                       | 200    |
| DELETE | `/charges/:id`              | Remove cobrança                         | 204    |

#### Payments
| Método | Endpoint          | Descrição                                      | Status |
|--------|-------------------|------------------------------------------------|--------|
| GET    | `/payments`       | Lista todos os pagamentos                      | 200    |
| GET    | `/payments/:id`   | Busca pagamento por ID                         | 200    |
| POST   | `/payments`       | Cria pagamento e atualiza charge (transação)   | 201    |
| DELETE | `/payments/:id`   | Remove pagamento                               | 204    |

### Exemplos de Requisições

**POST /customers** - Criar cliente
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "cpf": "12345678900"
  }'
```

**Resposta (201 Created)**:
```json
{
  "id": 1,
  "name": "João Silva",
  "cpf": "12345678900"
}
```

**POST /charges** - Criar cobrança
```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "amount": 100.50,
    "dueDate": "2026-03-01T00:00:00.000Z"
  }'
```

**Resposta (201 Created)**:
```json
{
  "id": 1,
  "customerId": 1,
  "amount": "100.50",
  "dueDate": "2026-03-01T00:00:00.000Z",
  "status": "PENDENTE",
  "createdAt": "2026-02-05T12:00:00.000Z",
  "updatedAt": "2026-02-05T12:00:00.000Z"
}
```

**POST /payments** - Criar pagamento (atualiza charge atomicamente)
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "chargeId": 1,
    "amount": 100.50,
    "method": "PIX"
  }'
```

**Resposta (201 Created)**:
```json
{
  "id": 1,
  "chargeId": 1,
  "amount": "100.50",
  "method": "PIX",
  "paidAt": "2026-02-05T12:30:00.000Z",
  "charge": {
    "id": 1,
    "customerId": 1,
    "amount": "100.50",
    "dueDate": "2026-03-01T00:00:00.000Z",
    "status": "PAGO",
    "createdAt": "2026-02-05T12:00:00.000Z",
    "updatedAt": "2026-02-05T12:30:00.000Z"
  }
}
```

## 🛡️ Validações e DTOs

### Data Transfer Objects (DTOs)

Os DTOs definem o contrato de entrada da API usando decorators do `class-validator`:

**CreateCustomerDto**:
```typescript
export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value.replace(/\D/g, ''))  // Remove não-numéricos
  @Matches(/^\d{11}$/)                                 // Valida formato
  @IsCpf()                                             // Valida algoritmo
  cpf: string;
}
```

### Pipeline de Validação

A validação acontece globalmente via `ValidationPipe` configurado no `main.ts`:

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,      // Remove campos não declarados
  transform: true,      // Transforma objetos plain em instâncias DTO
}));
```

**Ordem de execução**:
1. `@Transform` - transforma o valor (ex: remove caracteres do CPF)
2. `@Matches` - valida formato regex
3. `@IsCpf` - valida algoritmo de dígitos verificadores

### Validação de CPF

#### Formato
- CPF deve conter exatamente 11 dígitos
- Aceita entrada com formatação (`123.456.789-00`) ou sem (`12345678900`)
- O `@Transform` remove automaticamente pontos e hífens

#### Algoritmo de Dígitos Verificadores

Implementado no validador customizado `@IsCpf()`:

1. **Rejeita sequências repetidas** (ex: `11111111111`)
2. **Calcula primeiro dígito verificador**:
   - Multiplica os 9 primeiros dígitos por sequência decrescente (10 a 2)
   - Soma e calcula resto da divisão por 11
   - Se resto < 2, dígito = 0; senão dígito = 11 - resto
3. **Calcula segundo dígito verificador**:
   - Multiplica os 10 primeiros dígitos por sequência decrescente (11 a 2)
   - Aplica mesma lógica do primeiro dígito

**Importante**: A validação verifica apenas a validade matemática do CPF. Um CPF pode passar no algoritmo mas estar irregular na Receita Federal (suspenso, cancelado ou pendente de regularização). Para validação completa, seria necessário integrar com APIs oficiais da Receita Federal.

### Tratamento de Erros

O `AllExceptionsFilter` mapeia erros do Prisma para códigos HTTP adequados e **sanitiza mensagens** (evitando vazamento de detalhes internos do BD), enquanto loga detalhes completos server-side:

| Erro Prisma | Código HTTP | Descrição |
|-------------|-------------|-----------|--------|
| P2002       | 409 Conflict | Unique constraint (CPF duplicado, chargeId já possui pagamento) |
| P2025       | 404 Not Found | Registro não encontrado |
| P2003       | 400 Bad Request | Violação de foreign key |
| PrismaClientInitializationError | 503 Service Unavailable | Falha de conexão com BD |
| Outros erros Prisma | 500 Internal Server Error | Erro genérico de banco de dados |

## 🏗️ Arquitetura e Boas Práticas

### NestJS

Framework modular baseado em TypeScript que implementa:
- **Injeção de Dependência** - Gerenciamento automático de dependências
- **Módulos** - Organização em contextos isolados
- **Providers** - Services injetáveis com escopo singleton
- **Controllers** - Camada de roteamento HTTP
- **Pipes** - Transformação e validação de dados
- **Filters** - Tratamento de exceções
- **Decorators** - Metaprogramação declarativa

### Prisma ORM

Usado como camada de acesso a dados com:
- **Schema declarativo** - Modelagem em `schema.prisma`
- **Type-safety** - Tipos TypeScript gerados automaticamente
- **Migrations** - Versionamento do schema
- **Relacionamentos** - Foreign keys e cascade operations
- **Client tipado** - Autocomplete e validação em tempo de desenvolvimento

**Exemplo de query**:
```typescript
return this.prisma.customer.findMany({
  orderBy: { name: 'asc' },
  include: { charges: true }
});
```

### Princípios Aplicados

- **Separation of Concerns**: Controller → Service → Repository (Prisma)
- **Dependency Injection**: Desacoplamento e testabilidade
- **DTO Pattern**: Validação e documentação de contratos
- **Repository Pattern**: Prisma abstrai acesso ao banco
- **Exception Filters**: Tratamento centralizado de erros
- **Factory Pattern**: Geração de dados de teste reutilizáveis

### Boas Práticas de Teste

- **Unit Tests co-localizados** - `*.spec.ts` ao lado do código
- **Factories centralizadas** - `test/factories/` para reuso
- **Mocks type-safe** - `jest-mock-extended` para manter tipagem
- **AAA Pattern** - Arrange-Act-Assert claramente separados
- **Isolamento** - Cada teste é independente e pode rodar sozinho
- **Coverage** - Cobertura de casos felizes e de erro


## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start:dev` | Inicia em modo desenvolvimento (hot-reload) |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run start` | Inicia em modo produção |
| `npm test` | Executa testes unitários (58 testes) |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:cov` | Gera relatório de cobertura |
| `npm run lint` | Executa ESLint e corrige problemas automaticamente |
| `npm run format` | Formata código com Prettier |
| `npm run prepare` | Instala Husky git hooks (pre-commit) |
| `npm run prisma:generate` | Gera cliente Prisma tipado |
| `npm run prisma:migrate` | Cria e aplica migration |
| `npm run prisma:seed` | Popula banco com 20 customers, 500 charges e 147 payments |
| `npx prisma studio` | Abre interface visual do Prisma |

### Git Hooks Automatizados

O projeto usa **Husky + lint-staged** para garantir qualidade de código:

- **pre-commit**: Executa `lint-staged` automaticamente
  - Arquivos `.ts`: ESLint --fix + Prettier
  - Arquivos `.js`: Prettier

Para contornar hooks (não recomendado):
```bash
git commit --no-verify
```
