-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS debt_system;

-- Utilização do banco de dados
USE debt_system;

-- Criação da tabela de Dívidas
CREATE TABLE IF NOT EXISTS debts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  expire_date DATE NOT NULL,
  status ENUM('PENDENTE', 'PAGO') DEFAULT 'PENDENTE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Validações
  CONSTRAINT chk_positive_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para melhorar performance
CREATE INDEX idx_status ON debts(status);
CREATE INDEX idx_expire_date ON debts(expire_date);
CREATE INDEX idx_client_name ON debts(client_name);