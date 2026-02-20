# 🚀 Teste Técnico – Estágio em Desenvolvimento

## Pré requisitos 
1. git 
2. node
3. docker (para MySQL)

## Como executar o projeto:
1. Executar o servidor MySQL
```bash
 docker run --name teste-tecnico -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
 docker exec -it teste-tecnico mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS billing_app;"
 ```

 2. Criar tabelas necessarias:
 ```bash
 npx drizzle-kit push
 ```
3. Instale as dependencias com o comando:
```bash 
npm install
```

4. Execute no modo desenvolvedor: 
```bash
npm run dev
```

5. Abra o link http://localhost:5173/ no navegador de sua preferencia. 
