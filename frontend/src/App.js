import './App.css';
import { useState } from 'react';
import { postCobranca } from './api';
import styled from 'styled-components'
function App() {
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
      <Botao
        onClick={salvar}
      >
        Salvar
      </Botao>
    </Tela>
  );
}
const Tela=styled.div`
width:100vw;
height:100vh;
display:flex;
background:gray;
align-items:center;
flex-direction:column;
div{
  display:flex;
  box-sizing:border-box;
}
button{
  border:0;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
}
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
export default App;
