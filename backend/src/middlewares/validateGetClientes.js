export async function validateGetClientes (req,res,next){
    const {ordenacao,asc}=req.query
    const ordenacoesPermitidas = ['cliente','valor_total',];
    try {
        if (!ordenacoesPermitidas.includes(ordenacao)) {
            return res.status(422).send('Ordenação inválida');
        }
        if (asc!=='DESC' && asc!=='ASC') {
            return res.status(422).send('Crescente inválida');
        }
        next()
    } catch (error) {
        console.log('Erro em middleware validateGetClientes: ',error)
        res.sendStatus(500)
    }
}