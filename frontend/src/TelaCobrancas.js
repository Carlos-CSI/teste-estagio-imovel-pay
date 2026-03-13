import { useEffect, useState } from 'react';
import { getCobrancas, postCobranca } from './api';
import styled from 'styled-components'
import Cobranca from './Cobranca';

export default function TelaCobrancas(){
    const [cobrancas,setCobrancas]=useState([])
    function buscar(){
    getCobrancas().then(res=>{
        setCobrancas(res.data)
    }).catch(err=>{
        console.log(err)
    })
    }
    useEffect(buscar,[])
    return (
        <Tela>
            {cobrancas.map(infos=><Cobranca refresh={buscar} infos={infos}/>)}
        </Tela>
    )
}
const Tela=styled.div`
align-items:center;
flex-direction:column;

`
const Botao=styled.button`
width:150px;
height:40px;
background:black;
color:white;
margin-top:20px;
border-radius:10px
`