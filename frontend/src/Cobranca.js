import { useEffect, useState } from 'react';
import { getCobrancas, postCobranca } from './api';
import styled from 'styled-components'
import { formatarData, formatarHorario } from './utils';
export default function Cobranca({infos}){
    const {id,cliente,valor,data_vencimento,data_criacao,status}=infos
    return (
        <Holder>
            <Infos>
            <p>{cliente}</p>
            <p>{valor}</p>
            <p>{formatarData(data_vencimento)}</p>
            </Infos>
            <h5>{formatarHorario(data_criacao)}</h5>
        </Holder>
    )
}
const Infos=styled.div`
flex-direction:column;
width:400px;
height:80px;
background:white;
border-radius:10px;
padding:10px;
p{
  margin:0;
}
`
const Holder=styled.div`
flex-direction:column;
width:400px;
height:100px;
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