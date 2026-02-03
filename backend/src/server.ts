import dotenv from "dotenv";
import app from "./app";
import { testConnection } from "./config/database";

dotenv.config();

// Inicialização do Servidor
const PORT = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    console.log("Iniciando servidor...");
    console.log("Modo de armazenamento: MYSQL");

    // Testar conexão com MySQL
    console.log("Testando conexão com MySQL... ");

    const isConnected = await testConnection();

    if (!isConnected) {
      console.error(`
        Não foi possível conectar ao MySQL.
        
        IMPORTANTE:
        1. Certifique-se que o MySQL está rodando
        2. Configure o arquivo .env com as credenciais corretas
        3. Execute o script: mysql -u root -p < database/schema.sql
        `);
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
        Servidor rodando com sucesso!
        URL: http://localhost:${PORT}

        Ambiente: ${process.env.NODE_ENV || "development"}
        Banco de Dados: MySQL (${process.env.DB_NAME}) 

        Rotas disponíveis:
        POST /api/cobrancas
        GET /api/cobrancas
        GET /api/cobrancas/:id
        PATCH /api/cobrancas/:id/status
        GET /api/cobrancas/estatisticas
                
        Para encerrar o servidor, pressione Ctrl+C.
        `);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro 404";
    console.error("Falha ao iniciar o servidor:", errorMessage);
    process.exit(1);
  }
};

startServer();
