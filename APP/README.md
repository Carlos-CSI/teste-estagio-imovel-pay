# 💻 Frontend

## 💰 Sistema de Gestão de Cobranças

Um sistema para gerenciamento de cobranças de clientes, permitindo o cadastro, edição, busca e controle de pagamentos. Desenvolvido com foco em usabilidade e agilidade no preenchimento de dados.

![alt text](<sistema cobrança .jpeg>)

## 🛠️Tecnologias Utilizadas

- **React 19 +vite**: Biblioteca base para a construção da interface.

- **Axios**: Cliente HTTP para consumo da API.

- **Hooks** (useState, useEffect, useRef): para controle de fluxo e UX.

- **CSS3**: Estilização personalizada com layouts flexíveis.

- **HTML5**

## ✨Funcionalidades principais

- **Máscaras Automáticas**: Formatação em tempo real para CPF, Telefone e Moeda (BRL).

- **Fluxo por Teclado**: Função pularFoco que permite navegar entre os campos do formulário usando a tecla Enter.

**Paginação Inteligente**: Navegação por páginas controlada pelo backend para suportar grandes volumes de dados.

- **Busca em Tempo Real**: Filtro de clientes por nome diretamente na barra de busca.

- **Auto-Scroll**: O sistema centraliza o formulário automaticamente ao iniciar uma edição ou nova cobrança.

## 📂 Estrutura do Projeto

- **CobrancaForm**: Componente com lógica de máscaras e referências de foco.

- **CobrancaTable**: Exibição dos dados com tratamento de moedas e datas.

- **Pagination**: Controle visual da navegação entre páginas.

## 🚀 Como Executar

Entre na pasta do projeto:

1. Instale as dependências:
   npm install

2. Inicie o projeto:
   npm run dev

O sistema rodará em:
http://localhost:5173

## 👩‍💻 Desenvolvido por:

Rosa Mendes
