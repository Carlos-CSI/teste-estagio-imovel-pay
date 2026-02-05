import sqlite3
# Função para conectar ao banco de dados SQLite
def conectar():
    return sqlite3.connect("cobrancas.db") #Conecta ao arquivo do banco de dados
# Função para criar a tabela de cobranças se não existir
def criar_tabela(): 
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cobrancas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_cliente TEXT,
            valor REAL,
            data_vencimento TEXT,
            status TEXT 
        )
    """)
    conn.commit() #Salva as mudanças
    conn.close() #Fecha a conexão
