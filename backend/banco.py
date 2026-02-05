import sqlite3

def conectar():
    return sqlite3.connect("cobrancas.db")

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
    conn.commit()
    conn.close()
