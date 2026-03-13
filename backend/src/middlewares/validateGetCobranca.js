export async function validateGetCobranca (req,res,next){
    const {ordenacao,asc,filtro}=req.query
    const ordenacoesPermitidas = ['data_criacao','data_vencimento','valor','cliente',];
    const filtrosPermitidas = ['TODOS','PENDENTE','PAGO'];
    try {
        if (!filtrosPermitidas.includes(filtro)) {
            return res.status(422).send('Filtro inválido');
        }
        if (!ordenacoesPermitidas.includes(ordenacao)) {
            return res.status(422).send('Ordenação inválida');
        }
        if (asc!=='DESC' && asc!=='ASC') {
            return res.status(422).send('Crescente inválida');
        }
        next()
    } catch (error) {
        console.log('Erro em middleware validateGetCobranca: ',error)
        res.sendStatus(500)
    }
}