import dayjs from 'dayjs'
export async function validatePostCobranca (req,res,next){
    const {cliente,valor:valorString,dataVencimento:objetoData}=req.body
    try {
        if(!cliente){
            return res.status(422).send('Cliente inválido');
        }
        const valor=parseFloat(valorString)
        if(isNaN(valor)){
            return res.status(422).send('Valor inválido');
        }
        res.locals.valor=valor
        const {dia,mes,ano}=objetoData
        const diaInt=parseInt(dia)
        const mesInt=parseInt(mes)
        const anoInt=parseInt(ano)
        if(isNaN(diaInt)||diaInt<1||diaInt>31){
            return res.status(422).send('Dia inválido');
        }
        if(isNaN(mesInt)||mesInt<1||mesInt>12){
            return res.status(422).send('Mês inválido');
        }
        if(isNaN(mesInt)||anoInt<1||anoInt>100){
            return res.status(422).send('Ano inválido');
        }
        const dataVencimento =dayjs(`20${ano}-${mes}-${dia}`).format('YYYY-MM-DD')
        res.locals.dataVencimento=dataVencimento
        next()
    } catch (error) {
        console.log('Erro em middleware validatePostCobranca: ',error)
        res.sendStatus(500)
    }
}