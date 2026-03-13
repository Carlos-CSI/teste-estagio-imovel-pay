import { putCobranca } from './api';
import styled from 'styled-components'
import { formatarData, formatarHorario } from './utils';
export default function Cobranca({infos,refresh}){
    const {id,cliente,valor,data_vencimento,data_criacao,status}=infos
    function alterarStatus(){
        putCobranca(id).then(res=>{
            refresh()
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <Holder>
            <Infos>
                <section>
                    <Etiqueta>
                        <h6>Cliente:</h6>
                        <p>{cliente}</p>
                    </Etiqueta>
                    <Etiqueta>
                        <h6>Valor:</h6>
                        <p>R$ {valor}</p>
                    </Etiqueta>
                    <Etiqueta>
                        <h6>Vencimento:</h6>
                        <p>{formatarData(data_vencimento)}</p>
                    </Etiqueta>
                </section>
                <aside>
                    <Status pago={status==='PAGO'}>
                        <h4>{status}</h4>
                    </Status>
                    {status!=='PAGO'?
                    <Botao onClick={alterarStatus}>
                        <p>Quitar</p>
                    </Botao>
                    :<></>}
                </aside>
            </Infos>
            <h5>{formatarHorario(data_criacao)}</h5>
        </Holder>
    )
}
const Etiqueta=styled.div`
min-height:25px;
background:white;
align-items:center;
p{
  margin:0;
  font-size:15px;
}
h6{
    text-align: right;
  margin:0 10px 0 0;
  font-weight:400;
  color:gray;
  width:60px;
}
@media(min-width:850px){
    width:180px;
}
`
const Botao=styled.button`
width:120px;
height:35px;
background:black;
color:white;
border-radius:10px
`
const Status=styled.div`
background:${p=>p.pago?'#89ff89':'#f98686'};
color:${p=>p.pago?'green':'#aa0000'};
width: fit-content;
h4{
  margin:5px;
  font-weight:500;
  text-align:center;
}
  border-radius:10px;
`

const Infos=styled.div`
width:100%;
min-height:90px;
justify-content:space-between;
background:white;
border-radius:10px;
padding:10px;
section{
    display:flex;
    flex-direction:column;
}
aside{
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    height:75px;
    justify-content:space-between;
}
@media(min-width:850px){
    min-height:50px;
    section{
        flex-direction:row;
    }
    aside{
        height:40px;
        flex-direction: row-reverse;
        align-items:center;
        gap:10px;
    }
}
`
const Holder=styled.div`
flex-direction:column;
width:calc(100% - 30px);
max-height:120px;
background:darkgray;
margin-top:15px;
border-radius:10px;
h5{
  margin:0;
  width:100%;
  font-weight:400;
  text-align:center;
}
max-width:820px;
@media(min-width:850px){
    h5{
        text-align:end;width:calc(100% - 10px);
    }
}
`