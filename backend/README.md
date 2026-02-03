# API de Gestão de Clientes

API RESTful desenvolvida com NestJS para gerenciamento de clientes (customers) e cobranças (charges), com validação de CPF, testes unitários e documentação Swagger.

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

### Documentação
- **[Swagger/OpenAPI](https://swagger.io/)** via `@nestjs/swagger` v6.3.0 - Documentação interativa da API

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
- ✅ **Remover cliente** - `DELETE /customers/:id` (cascade delete para charges)

### Validações Implementadas
- **CPF**: Validação de formato (11 dígitos) + algoritmo de dígitos verificadores
- **Unicidade**: Restrição de CPF único no banco de dados
- **Integridade referencial**: Relacionamento Customer → Charges com cascade delete
- **Tipos de entrada**: ParseIntPipe para IDs, whitelist para DTOs

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── main.ts                      # Bootstrap da aplicação
│   ├── app.module.ts                # Módulo raiz
│   ├── customers/                   # Módulo de clientes
│   │   ├── customers.controller.ts      # Rotas HTTP
│   │   ├── customers.controller.spec.ts # Testes do controller
│   │   ├── customers.service.ts         # Lógica de negócio
│   │   ├── customers.service.spec.ts    # Testes do service
│   │   ├── customers.module.ts          # Definição do módulo
│   │   └── dto/                         # Data Transfer Objects
│   │       ├── create-customer.dto.ts
│   │       └── update-customer.dto.ts
│   ├── commons/                     # Código compartilhado
│   │   └── validators/
│   │       └── is-cpf.validator.ts      # Validador customizado de CPF
│   ├── filters/                     # Exception filters
│   │   └── http-exception.filter.ts     # Tratamento de erros Prisma/HTTP
│   └── prisma/
│       └── prisma.service.ts            # Serviço Prisma singleton
├── prisma/
│   └── schema.prisma                # Schema do banco de dados
├── test/
│   └── factories/                   # Factories para testes
│       ├── index.ts                     # Barrel de reexportação
│       ├── customers.factory.ts         # Factories de customers
│       └── README.md                    # Documentação das factories
├── jest.config.js                   # Configuração do Jest
├── tsconfig.json                    # Configuração TypeScript
├── package.json                     # Dependências e scripts
├── Dockerfile                       # Imagem Docker da aplicação
└── .env                            # Variáveis de ambiente
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
# Executar migrations do Prisma
npx prisma migrate dev

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
- Total: **20 testes passando**

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

| Método | Endpoint          | Descrição                    | Status |
|--------|-------------------|------------------------------|--------|
| GET    | `/customers`      | Lista todos os clientes      | 200    |
| GET    | `/customers/:id`  | Busca cliente por ID         | 200    |
| POST   | `/customers`      | Cria novo cliente            | 201    |
| PATCH  | `/customers/:id`  | Atualiza nome do cliente     | 200    |
| DELETE | `/customers/:id`  | Remove cliente               | 204    |

### Exemplo de Requisição

**POST /customers**
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

**UpdateCustomerDto**:
```typescript
export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
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

O `AllExceptionsFilter` mapeia erros do Prisma para códigos HTTP adequados:

| Erro Prisma | Código HTTP | Descrição |
|-------------|-------------|-----------|
| P2002       | 409 Conflict | CPF duplicado (unique constraint) |
| P2025       | 404 Not Found | Registro não encontrado |
| P2003       | 400 Bad Request | Violação de foreign key |
| PrismaClientInitializationError | 503 Service Unavailable | Falha de conexão com BD |

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
| `npm run start:prod` | Inicia em modo produção |
| `npm test` | Executa testes unitários |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:cov` | Gera relatório de cobertura |
| `npx prisma migrate dev` | Cria e aplica migration |
| `npx prisma studio` | Abre interface visual do Prisma |
