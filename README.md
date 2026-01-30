# 🚀 Teste Técnico – Estágio em Desenvolvimento

Bem-vindo(a)!

Este repositório contém o **teste técnico para a vaga de estágio em desenvolvimento**.  
O objetivo deste desafio **não é avaliar nível sênior**, mas entender **como você pensa, organiza o código, aprende e resolve problemas**.

Leia tudo com atenção antes de começar 👇

---

## 🏢 Contexto Geral

Trabalhamos com sistemas reais voltados para **pagamentos, cobranças e operações financeiras**.  
Neste desafio, você irá desenvolver uma aplicação **simples**, inspirada nesse contexto, sem necessidade de integrações externas ou regras complexas.

---

## ⏰ Prazo de Entrega

- **Data limite:** **13/02/2026**
- Pull Requests enviados após essa data **não serão considerados**

---

## ⚠️ Regras Importantes

- Este repositório é **público**
- **Não é permitido** commitar diretamente na branch `master`
- Crie **uma branch com o seu nome**  
  Exemplo: `joao-silva`
- Ao finalizar, abra **um Pull Request para a branch `master`**
- Não há template, boilerplate ou código inicial
- Toda a estrutura do projeto deve ser criada por você

---

## 🛠️ Stack Permitida

### Backend (escolha **uma** opção)
- PHP (preferencialmente seguindo padrões MVC, como CodeIgniter)
**ou**
- Node.js (Express ou similar)

### Frontend
- React.js

❌ **Não é necessário**
- Autenticação
- Deploy
- Estilização avançada

---

## 📌 Desafio Proposto

### Mini Sistema de Cobranças (Simplificado)

Você deverá criar um sistema simples para **gerenciar cobranças**, contendo backend e frontend.

---

## ✅ Requisitos Funcionais (MVP)

### 🔧 Backend

Criar uma API que permita:

1. Listar cobranças
2. Criar uma nova cobrança
3. Atualizar o status de uma cobrança

#### Campos mínimos de uma cobrança:
- Nome do cliente
- Valor
- Data de vencimento
- Status (`PENDENTE` ou `PAGO`)

📎 Observações:
- Os dados podem ser armazenados:
  - Em memória
  - Em arquivo (JSON, por exemplo)
  - Ou banco simples (opcional)
- Validações básicas são esperadas (campos obrigatórios)

---

### 🎨 Frontend (React)

Criar uma interface simples que permita:

1. Visualizar a lista de cobranças
2. Criar uma nova cobrança
3. Alterar o status de uma cobrança para `PAGO`

📎 Observações:
- O layout pode ser simples
- O foco é funcionalidade e organização
- Utilize componentes React e estado de forma básica

---

## 🧩 Requisitos Não Funcionais

- Código organizado e legível
- Nomes claros para variáveis, funções e arquivos
- Separação mínima de responsabilidades
- README explicando como rodar o projeto

---

## ⭐ Itens Opcionais (Diferenciais)

Os itens abaixo **não são obrigatórios**, mas contam como diferencial:

- Filtro por status (`PENDENTE` / `PAGO`)
- Ordenação por data de vencimento
- Tratamento de erro e loading no frontend
- Máscara simples para campo de valor
- Comentários explicando decisões importantes

---

## 🗂️ Estrutura Esperada (Sugestão)

Você é livre para organizar como quiser, mas uma sugestão seria:

