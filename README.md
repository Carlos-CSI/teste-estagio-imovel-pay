# Sistema de Cobranças - Desafio Técnico

Este repositório contém a solução para o desafio técnico de estágio em desenvolvimento. Trata-se de uma aplicação **Full Stack** para gerenciamento de cobranças, composta por uma API REST robusta em Java e um frontend moderno em React.

O projeto foi arquitetado focando em **boas práticas de Engenharia de Software**, incluindo separação de camadas, tratamento global de erros, DTOs e testes automatizados.

## 🚀 Tecnologias Utilizadas

### Backend (API)
* **Java 17** & **Spring Boot 3**
* **Spring Data JPA** (Persistência de dados)
* **MySQL** (Banco de dados relacional)
* **Lombok** (Produtividade e redução de código)
* **Bean Validation** (Validação de inputs)
* **GitHub Actions** (CI - Integração Contínua)

### Frontend (Interface)
* **React.js** (via Vite)
* **Axios** (Comunicação HTTP)
* **Bootstrap 5** (Interface responsiva)

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* Java JDK 17+
* Node.js 18+
* MySQL 8.0+

### 1. Configuração do Banco de Dados
Acesse seu cliente MySQL (Workbench, DBeaver ou Terminal) e crie o database:

```
CREATE DATABASE db_cobrancas;
Nota: As configurações de conexão estão no arquivo src/main/resources/application.properties. Ajuste os campos spring.datasource.username e spring.datasource.password antes de rodar.
```
### 2. Executando o Backend
Abra um terminal na raiz do projeto (onde está o arquivo pom.xml) e execute:

Via Maven Wrapper (Linux/Mac):

```Bash:
./mvnw spring-boot:run
Via Maven Wrapper (Windows):

Bash:
.\mvnw.cmd spring-boot:run

Ou, se tiver o Maven instalado globalmente:

Bash:
mvn spring-boot:run

✅ A API estará rodando em: http://localhost:8080/cobrancas
```
### 3. Executando o Frontend
Abra um novo terminal, navegue até a pasta do frontend e instale as dependências:
```
Bash:
cd frontend
npm install
npm run dev
✅ A aplicação abrirá no navegador em: http://localhost:5173 (ou porta similar indicada no terminal).
```
### 🏛️ Arquitetura e Decisões Técnicas
Durante o desenvolvimento, algumas decisões foram tomadas para garantir escalabilidade e manutenção:

Padrão DTO (Data Transfer Object):

Utilização de Java Records para transferir dados entre o cliente e o servidor.

Motivo: Evita expor a entidade de banco de dados diretamente (Segurança) e permite validações específicas na entrada da API.

Tratamento Global de Erros:

Implementação de um @RestControllerAdvice.

Motivo: Garante que qualquer erro (ex: campo obrigatório vazio) retorne um JSON limpo e amigável para o frontend, em vez de stacktraces técnicos.

Integração Contínua (CI):

Pipeline configurado via GitHub Actions.

Motivo: A cada push ou pull request, o sistema compila o projeto e roda todos os testes automaticamente, garantindo a integridade do código.


### ✅ Funcionalidades
[x] Criação de nova cobrança (com validação de valor e nome)

[x] Listagem de todas as cobranças

[x] Atualização de status (PENDENTE -> PAGO)

[x] Integração completa Frontend-Backend

[x] Persistência em Banco de Dados MySQL

Autor: [mauricioRodriguesDev](https://github.com/mauricioRodriguesDev)