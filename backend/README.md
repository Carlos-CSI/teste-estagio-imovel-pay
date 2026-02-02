# Backend (NestJS + Prisma)

Pasta `backend/` contém um esqueleto mínimo em NestJS com Prisma.

Comandos iniciais (na raiz `backend/`):

Instalar dependências:
```bash
cd backend
npm install
```

Gerar cliente Prisma e aplicar migrations (dev):
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Rodar em modo dev:
```bash
npm run start:dev
```


Observações:
- O `DATABASE_URL` deve estar definido no .env (ex.: `DATABASE_URL="mysql://user:pass@db:3306/dbname"`).
- Em desenvolvimento com Docker Compose, o host do banco é `db` (nome do serviço).
