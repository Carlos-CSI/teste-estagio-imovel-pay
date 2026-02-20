# 💰 Sistema de Gestão de Cobranças

API REST desenvolvida com Spring Boot para gerenciamento de cobranças.

---

## 🚀 Tecnologias Utilizadas

- **Java 21**: Versão mais recente com foco em performance.

- **Spring Boot 3**: Framework para agilidade no desenvolvimento.

- **Spring Data JPA**: Abstração da camada de persistência.

- **MySQL**: Banco de dados relacional para armazenamento seguro.

- **Bean Validation**: Garantia de integridade dos dados no servidor.

- **Lombok**: Redução de código boilerplate (Getters/Setters).
- **Maven** :Gerencia as depêndencias do projeto e organiza a estrutura padrão.
---

## ✨Funcionalidades principais

- **CRUD quase completo**: Endpoints para listar, buscar por ID, criar, atualizar.

- **Baixa Automática**: Endpoint específico para registrar pagamentos, que define o status como PAGO e registra a data exata da transação.

- **CORS Configurado**: Pronto para comunicação segura entre domínios diferentes.


## 📂 Estrutura do Projeto

### Backend (Spring Boot)

- **controller**: Endpoints REST da aplicação.

- **entity**: Modelagem das tabelas do banco de dados (Cobranca, Status).

- **repository**: Interfaces de comunicação com o banco (Spring Data JPA).

- **service**: Camada de lógica de negócio.

---

## ▶ Como executar o projeto
- Clone o repositório

- Certifique-se de ter o MySQL instalado e um banco chamado cobranca_db criado.

- Configure suas credenciais no arquivo application.properties.

- Execute o projeto via sua IDE ou terminal:

```bash
mvn spring-boot:run
```


## 📂 Estrutura de Endpoints (API)

| Método   | Endpoint                | Descrição                                     |
| :------- | :---------------------- | :-------------------------------------------- |
| **GET**  | `/cobranca?page=...`    | Lista cobranças com paginação                 |
| **POST** | `/cobranca`             | Cria uma nova cobrança (Inicia como PENDENTE) |
| **PUT**  | `/cobranca/{id}`        | Atualiza todos os dados de uma cobrança       |
| **PUT**  | `/cobranca/{id}/pagar/` | Registra pagamento e data atual               |

## 👩‍💻 Desenvolvido por:

Rosa Mendes

