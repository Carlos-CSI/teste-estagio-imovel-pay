# Frontend - Imóvel Pay

Sistema de Gerenciamento de Cobranças desenvolvido com React + TypeScript + Vite.

Aplicação completa com dashboard interativo, gestão de clientes, cobranças e pagamentos, incluindo gráficos, validações robustas e recursos de acessibilidade.

## 🚀 Tecnologias

- **React 19.2** + **TypeScript 5.9**
- **Vite 7.3** - Build tool e dev server
- **Tailwind CSS 3.4** - Estilização utilitária
- **React Router DOM 7** - Roteamento SPA
- **Axios** - Cliente HTTP com interceptors
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **Date-fns** - Manipulação segura de datas
- **React Toastify** - Notificações toast
- **Context API** - Gerenciamento de estado global

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🌐 Variáveis de Ambiente

O arquivo `.env` já está configurado:

```env
VITE_API_URL=http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
src/
├── api/                        # Cliente HTTP e endpoints
│   ├── index.ts               # Configuração do Axios e interceptors
│   ├── customers.ts           # API de clientes
│   ├── charges.ts             # API de cobranças
│   └── payments.ts            # API de pagamentos
│
├── components/
│   ├── common/                # Componentes compartilhados
│   │   ├── Spinner.tsx        # Loading spinner
│   │   └── Timer.tsx          # Temporizador para countdowns
│   │
│   ├── dashboard/             # Componentes do Dashboard
│   │   ├── StatsCard.tsx      # Cards de estatísticas
│   │   ├── ChargePieChart.tsx # Gráfico de pizza (cobranças por status)
│   │   └── RevenueBarChart.tsx # Gráfico de barras (receita mensal)
│   │
│   ├── customers/             # Componentes de clientes
│   │   ├── CustomerDetailsModal.tsx  # Modal de detalhes (usa React Portal)
│   │   ├── CustomerEditModal.tsx     # Modal de edição de cliente
│   │   ├── CustomerDeleteModal.tsx   # Modal de confirmação de exclusão
│   │   └── CreateCustomerModal.tsx   # Modal de criação de novo cliente
│   │
│   ├── charges/               # Componentes de cobranças
│   │   ├── ChargesTable.tsx          # Tabela global de cobranças
│   │   ├── ChargesTableLocal.tsx     # Tabela de cobranças no contexto do cliente
│   │   ├── ChargesFilters.tsx        # Filtros de cobranças
│   │   ├── CreateChargeModal.tsx     # Modal de criação de cobrança
│   │   └── ChargePaymentModal.tsx    # Modal de registro de pagamento
│   │
│   └── layout/                # Componentes de layout
│       ├── Layout.tsx         # Layout principal com ToastContainer
│       ├── Header.tsx         # Cabeçalho com toggle de menu
│       └── Sidebar.tsx        # Menu lateral responsivo e acessível
│
├── contexts/                  # Context API
│   └── AppContext.tsx         # Estado global (toast, loading, sidebar)
│
├── hooks/                     # Custom hooks
│   └── useCustomerDetails.ts  # Hook para detalhes do cliente
│
├── pages/                     # Páginas da aplicação
│   ├── Dashboard.tsx          # Dashboard com gráficos e estatísticas
│   ├── Customers.tsx          # Gestão de clientes
│   └── Charges.tsx            # Gestão de cobranças
│
├── types/                     # TypeScript types
│   └── index.ts              # Tipos principais e interfaces
│
├── utils/                     # Utilitários
│   ├── constants.ts          # Constantes da aplicação
│   ├── formatters.ts         # Formatadores (moeda, data, status)
│   ├── validators.ts         # Validadores (CPF, valores, datas)
│   └── number.ts             # Helpers de conversão numérica
│
├── App.tsx                    # Componente raiz com rotas
├── main.tsx                   # Entry point
└── index.css                  # Estilos globais + Tailwind
```

## 🎨 Tailwind CSS

O Tailwind CSS está configurado com tema personalizado:

### Paleta de Cores
- **Primary**: Azul (escala completa de 50 a 900, base: `#3b82f6`)
- **Success**: Verde `#10b981`
- **Warning**: Amarelo `#f59e0b`
- **Danger**: Vermelho `#ef4444`
- **Info**: Azul `#3b82f6`

### Classes Customizadas
- `animate-slide-in`: animação de entrada lateral (keyframe slideIn)
- Variantes de estado completas: `hover:`, `focus:`, `active:`
- Responsividade: breakpoints `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### Exemplo de uso:

```tsx
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
  Botão Primário
</button>

<div className="bg-success-50 border border-success-300 text-success-800 rounded-lg p-4">
  Mensagem de sucesso
</div>
```

## 🚦 Rotas da Aplicação

```tsx
/                    → Redirect para /dashboard
/dashboard           → Dashboard com gráficos e estatísticas
/customers           → Listagem e gestão de clientes
/charges             → Listagem e gestão de cobranças
```

Todas as rotas utilizam o mesmo layout (`Layout.tsx`) com sidebar e header.

## 🔄 Context API & Estado Global

O `AppContext` gerencia o estado global da aplicação através do Context API:

### Funcionalidades disponíveis:

```tsx
import { useApp } from './contexts/AppContext';

function Component() {
  const { 
    addToast,          // Adicionar notificação toast
    isLoading,         // Estado global de loading
    setIsLoading,      // Controlar loading global
    isSidebarOpen,     // Estado do menu lateral
    toggleSidebar      // Alternar menu lateral
  } = useApp();

  // Exibir notificação de sucesso
  addToast('success', 'Operação realizada com sucesso!');
  
  // Exibir notificação de erro
  addToast('error', 'Erro ao processar solicitação');
  
  // Controlar loading global
  setIsLoading(true);
  
  // Alternar sidebar (mobile)
  toggleSidebar();
}
```

**Importante:** A aplicação usa `react-toastify` para notificações. O `ToastContainer` já está montado no `Layout`, não é necessário montá-lo novamente. Use apenas `addToast()` do contexto.

## 🌐 API Client

O cliente HTTP (Axios) está configurado e pronto para uso:

```tsx
import { customersApi } from './api/customers';
import { chargesApi } from './api/charges';
import { paymentsApi } from './api/payments';

// Exemplo: buscar todos os clientes
const customers = await customersApi.getAll();

// Exemplo: criar nova cobrança
const charge = await chargesApi.create({
  customerId: 1,
  amount: 100.50,
  dueDate: '2026-03-15'
});

// Exemplo: criar pagamento
const payment = await paymentsApi.create({
  chargeId: 1,
  amount: 100.50,
  method: 'PIX'
});
```

## 🛠️ Utilitários

### Formatadores (`utils/formatters.ts`)

```tsx
import { 
  formatCurrency, 
  formatDate, 
  formatDateTime,
  formatPaymentMethod,
  formatChargeStatus,
  getStatusBadgeClass,
  isOverdue
} from './utils/formatters';

// R$ 1.234,56
formatCurrency(1234.56);

// 15/03/2026
formatDate('2026-03-15');

// 15/03/2026 às 14:30
formatDateTime('2026-03-15T14:30:00');

// PIX
formatPaymentMethod('PIX');

// Pendente
formatChargeStatus('PENDENTE');

// Classes Tailwind para badges de status
// Ex: 'bg-yellow-100 text-yellow-800 border-yellow-300'
getStatusBadgeClass('PENDENTE');

// Verifica se data de vencimento já passou (compara no nível do dia)
isOverdue('2026-02-09'); // true se a data for passada
```

### Validadores (`utils/validators.ts`)

```tsx
import { 
  validateCPF, 
  formatCPF, 
  unformatCPF,
  validateAmount,
  validateFutureDate 
} from './utils/validators';

// Valida CPF (retorna true ou false)
validateCPF('123.456.789-00');

// Formata CPF: 123.456.789-00
formatCPF('12345678900');

// Remove formatação: 12345678900
unformatCPF('123.456.789-00');

// Valida se valor é positivo
validateAmount(100.50);

// Valida se data é futura (usa date-fns, comparação segura no nível do dia)
validateFutureDate('2026-03-15');
```

### Helpers Numéricos (`utils/number.ts`)

```tsx
import { parseCurrencyToNumber } from './utils/number';

// Converte string de moeda pt-BR para número
// 'R$ 1.234,56' ou '1.234,56' → 1234.56
// Retorna 0 se inválido
parseCurrencyToNumber('R$ 1.234,56'); // 1234.56
parseCurrencyToNumber('abc');         // 0
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## ✨ Funcionalidades Implementadas

### 📊 Dashboard
- Estatísticas em tempo real (total de clientes, cobranças, pagamentos)
- Gráfico de pizza: distribuição de cobranças por status
- Gráfico de barras: evolução da receita mensal
- Carregamento assíncrono de dados com tratamento de erros

### 👥 Gestão de Clientes
- **Listagem completa de clientes** com tabela responsiva
- **Filtro por CPF** em tempo real com máscara de formatação
- **Botão "Novo Cliente"** posicionado ao lado do filtro para fácil acesso
- **Modal de criação de cliente** com:
  - Validação de CPF (algoritmo verificador completo)
  - Máscara automática de CPF durante digitação
  - Validação de campos obrigatórios (nome e CPF)
  - Feedback visual de erros e sucesso via toasts
- **Modal de detalhes do cliente** implementado com **React Portal**:
  - Renderizado em `document.body` para escapar contextos de stacking
  - Lista de cobranças do cliente com filtros (status, ordenação)
  - Ações de editar e excluir cliente
  - Botão para registrar pagamentos de cobranças
- **Modal de edição** com validação de campos
- **Modal de exclusão** com confirmação segura
- **Gerenciamento de z-index** para modais aninhados:
  - Modal principal: `z-50`
  - Modais filhos (edit/delete/payment): `z-[60]`
  - Garante que modais aninhados apareçam corretamente sobre modais pai

### 📄 Gestão de Cobranças
- Criação de cobranças via modal com validação de campos
- Edição e exclusão de cobranças
- Filtros por status e ordenação
- Indicadores visuais de status (pendente, paga, vencida)
- Validação de datas e valores

### 💰 Registro de Pagamentos
- Registro de pagamentos direto na cobrança
- Múltiplos métodos de pagamento (PIX, Boleto, Cartão)
- Vinculação automática com a cobrança correspondente
- Validações robustas de valor e método

### ♿ Acessibilidade
- **Navegação por teclado**: todos os componentes interativos são acessíveis via teclado
- **ARIA labels**: atributos `aria-label`, `aria-expanded`, `aria-controls`, `aria-hidden`, `aria-modal`, `role="dialog"` implementados
- **Gerenciamento de foco**: foco é movido automaticamente ao abrir/fechar o menu lateral
- **Atalhos de teclado**: tecla `Escape` fecha o menu lateral
- **Overlay acessível**: overlay do menu é um `<button>` acessível, não apenas uma div clicável
- **Feedback visual**: estados de hover, focus e active bem definidos
- **Modais acessíveis**: 
  - Atributos `role="dialog"` e `aria-modal="true"` em todos os modais
  - Títulos identificados com `aria-labelledby`
  - Botões de fechar com `aria-label` descritivos
  - Backdrop clicável para fechar modais
  - React Portal garante que modais cubram todo o viewport (incluindo header sticky)

### 🛡️ Segurança e Validação
- Validação de CPF com algoritmo verificador
- Validação de datas usando `date-fns` (evita problemas de timezone)
- Normalização de valores monetários (formato pt-BR)
- Tratamento de valores inválidos com fallbacks seguros
- Sanitização de dados de entrada

## 🔗 Endpoints da API

Base URL: `http://localhost:3000`

### Clientes
- `GET /customers` - Listar todos os clientes
- `GET /customers/:id` - Buscar cliente por ID
- `POST /customers` - Criar novo cliente
- `PATCH /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Deletar cliente

### Cobranças
- `GET /charges` - Listar cobranças (com paginação e filtros opcionais)
- `GET /charges/:id` - Buscar cobrança por ID
- `POST /charges` - Criar nova cobrança
- `PATCH /charges/:id` - Atualizar cobrança
- `DELETE /charges/:id` - Deletar cobrança

### Pagamentos
- `POST /payments` - Criar novo pagamento
- `DELETE /payments/:id` - Deletar pagamento

## 🔧 Considerações Técnicas

### Gerenciamento de Estado
- **Context API** para estado global leve (toasts, loading, UI)
- Estado local com `useState` para formulários e listas
- `useEffect` com guards de montagem para evitar memory leaks

### Tratamento de Erros
- Interceptors do Axios capturam erros globalmente
- Toasts informativos para feedback ao usuário
- Fallbacks seguros em formatadores e parsers (retorna valores padrão ao invés de quebrar)

### Performance
- Componentes funcionais com hooks modernos
- Callbacks memoizados (`useCallback`) em contextos para evitar re-renders
- Lazy loading pode ser adicionado futuramente com `React.lazy()`
- **React Portal** para modais: evita problemas de stacking context e z-index

### TypeScript
- Tipagem forte em toda a aplicação
- Interfaces compartilhadas entre componentes
- Tipos derivados de objetos `as const` para manter single source of truth

### Datas e Internacionalização
- `date-fns` para manipulação segura de datas (evita problemas de timezone)
- Formato pt-BR para datas e moedas
- Comparações de data no nível do dia (`startOfDay`)

## 🎯 Padrões de Implementação

### React Portal para Modais

Os modais principais (como `CustomerDetailsModal`) utilizam `createPortal` do React para renderizar fora da hierarquia DOM normal:

```tsx
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <article className="bg-white rounded-lg">
        {children}
      </article>
    </div>
  );

  return createPortal(modal, document.body);
}
```

**Benefícios:**
- Escapa de contextos de stacking (inclui header sticky)
- Backdrop cobre toda a tela, garantindo visual consistente
- Facilita gerenciamento de z-index entre modais pai e filho
- Melhora acessibilidade e comportamento de foco

### Estratégia de Z-Index

```
Header sticky:        z-10
Modal principal:      z-50
Modais filhos:        z-[60]
```

Todos os modais seguem esta convenção para garantir empilhamento correto.

## 📦 Versão

**v1.0.0** - Frontend completo com sistema de modais robusto, React Portal, gestão de clientes completa e todas as funcionalidades principais implementadas.

---

**Desenvolvido por:** [Christian Volz](https://github.com/christianbvolz)  
**Backend:** NestJS + Prisma + PostgreSQL  
**Frontend:** React + TypeScript + Vite
```
