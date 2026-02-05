from fastapi import FastAPI
from pydantic import BaseModel
from banco import conectar, criar_tabela
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
@app.get("/")
def root():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
"""COmentario"""
criar_tabela()
class Cobranca(BaseModel):
    nome_cliente: str
    valor: float
    data_vencimento: str
    status: str 

"""COmentario"""
@app.post("/cobrancas")
def criar_cobranca(cobranca: Cobranca):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO cobrancas (nome_cliente, valor, data_vencimento, status) VALUES (?, ?, ?, ?)",
        (cobranca.nome_cliente, cobranca.valor, cobranca.data_vencimento, cobranca.status),
    )
    conn.commit()
    conn.close()
    return {"status": "ok"}
"""COmentario"""
@app.get("/cobrancas")
def listar_cobrancas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome_cliente, valor, data_vencimento, status FROM cobrancas")
    dados = cursor.fetchall()
    conn.close()

    return [
        {"id": d[0], "nome_cliente": d[1], "valor": d[2], "data_vencimento": d[3], "status": d[4]}
        for d in dados
    ]
"""COmentario"""
@app.put("/cobrancas/{id}")
def atualizar_status(id: int, dados: StatusUpdate):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE cobrancas SET status = ? WHERE id = ?",
        (dados.status, id),
    )
    conn.commit()
    conn.close()
    return {"status": "atualizado"}