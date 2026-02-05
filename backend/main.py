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
    allow_origins=["*"],    # Permite requisições de qualquer origem
    allow_methods=["*"],    # Permite todos os métodos HTTP
    allow_headers=["*"],    # Permite todos os headers
)
#Cria a tabela no banco de dados se não existir
criar_tabela()

#Modelos Pydantic para validação de dados
class Cobranca(BaseModel):
    nome_cliente: str
    valor: float
    data_vencimento: str
    status: str

#Modelo para atualização de status
class StatusUpdate(BaseModel):
    status: str

#Endpoints da API
@app.post("/cobrancas")
def criar_cobranca(cobranca: Cobranca):
    conn = conectar()   #Conecta ao banco de dados
    cursor = conn.cursor()
    #Insere a nova cobrança no banco de dados
    cursor.execute(
        "INSERT INTO cobrancas (nome_cliente, valor, data_vencimento, status) VALUES (?, ?, ?, ?)",
        (cobranca.nome_cliente, cobranca.valor, cobranca.data_vencimento, cobranca.status),
    )
    conn.commit() #Salva as mudanças
    conn.close()    #Fecha a conexão
    return {"status": "ok"}     #Retorna status ok

#Endpoint para listar todas as cobranças
@app.get("/cobrancas")
def listar_cobrancas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome_cliente, valor, data_vencimento, status FROM cobrancas")
    dados = cursor.fetchall()
    conn.close()
# Retorna a lista de cobranças como uma lista de dicionários
    return [
        {
            "id": d[0],
            "nome_cliente": d[1],
            "valor": d[2],
            "data_vencimento": d[3],
            "status": d[4],
        }
        for d in dados #'dados' é uma lista de tuplas retornadas pelo banco de dados
    ]

#Endpoint para atualizar o status de uma cobrança
#Recebe o ID da cobrança na URL e o novo status no corpo da requisição
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
