import { useEffect, useState } from 'react';
import { getCobrancas } from './api';
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
overflow:auto;
padding-bottom:20px;
`
