import { useEffect, useState } from 'react';
import { putCobranca, postCobranca } from './api';
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
                    <p>{cliente}</p>
                    <p>{valor}</p>
                    <p>{formatarData(data_vencimento)}</p>
                </section>
                <section style={{alignItems:'flex-end'}}>
                    <Status pago={status=='PAGO'}>
                        <h4>{status}</h4>
                    </Status>
                    <Botao onClick={alterarStatus}>
                        <p>Alterar status</p>
                    </Botao>
                </section>
            </Infos>
            <h5>{formatarHorario(data_criacao)}</h5>
        </Holder>
    )
}
const Botao=styled.button`
width:150px;
height:40px;
background:black;
color:white;
margin-top:10px;
border-radius:10px
`
const Status=styled.div`
background:${p=>p.pago?'#89ff89':'#f98686'};
color:${p=>p.pago?'green':'red'};
h4{
  margin:5px;
  font-weight:500;
  text-align:center;
}
  border-radius:10px;
`

const Infos=styled.div`
width:400px;
height:90px;
justify-content:space-between;
background:white;
border-radius:10px;
padding:10px;
p{
  margin:0;
}
section{
  display:flex;
flex-direction:column
}
`
const Holder=styled.div`
flex-direction:column;
width:400px;
height:110px;
background:darkgray;
margin-top:20px;
border-radius:10px;
h5{
  margin:0;
  width:100%;
  font-weight:500;
  text-align:center;
}
`