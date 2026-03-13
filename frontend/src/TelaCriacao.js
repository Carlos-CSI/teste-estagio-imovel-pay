import { useEffect, useState } from 'react';
import { getCobrancas, postCobranca } from './api';
import styled from 'styled-components'

export default function TelaCriacao(){
    const [cliente,setCliente]=useState('')
    const [dataVencimento,setDatadataVencimento]=useState('')
    const [valor,setValor]=useState('')
    function salvar(){
        postCobranca({cliente,dataVencimento,valor}).then(res=>{
          setCliente('')
          setDatadataVencimento('')
          setValor('')
        }).catch(err=>{
          console.log(err)
        })
      }
    return (
        <Tela>
            <input 
                value={cliente} 
                onChange={e=>{setCliente(e.target.value)}}
                placeholder='Cliente...'/>
            <input 
                value={valor} 
                onChange={e=>{setValor(e.target.value)}}
                placeholder='Valor...'/>
            <input 
                value={dataVencimento} 
                onChange={e=>{setDatadataVencimento(e.target.value)}}
                placeholder='Data de vencimento...'/>
            <Botao onClick={salvar}>
                <p>Salvar</p>
            </Botao>
      </Tela>
    )
}
const Tela=styled.div`
align-items:center;
flex-direction:column;
input{
  width:250px;
  height:40px;
  margin-top:20px;
  border:0;border-radius:10px;
  padding-left:10px;
}
`
const Botao=styled.button`
width:150px;
height:40px;
background:black;
color:white;
margin-top:20px;
border-radius:10px
`