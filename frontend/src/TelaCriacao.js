import { useEffect, useState } from 'react';
import { postCobranca } from './api';
import styled from 'styled-components'

export default function TelaCriacao(){
    const [cliente,setCliente]=useState('')
    const [diaVencimento,setDiaVencimento]=useState('')
    const [mesVencimento,setMesVencimento]=useState('')
    const [anoVencimento,setAnoVencimento]=useState('26')
    const [cobrancaCriada,setCobrancaCriada]=useState(false)
    const [valor,setValor]=useState('')
    function salvar(){
        const dataVencimento={
            dia:diaVencimento,mes:mesVencimento,ano:anoVencimento
        }
        postCobranca({cliente,dataVencimento,valor}).then(res=>{
          setCliente('')
          setDiaVencimento('')
          setMesVencimento('')
          setAnoVencimento('26')
          setValor('')
          setCobrancaCriada(true)
          setTimeout(() => {setCobrancaCriada(false)}, 4000);
        }).catch(err=>{
          console.log(err)
        })
      }
    return (
        <Tela>
            <form onSubmit={salvar}>
                <input 
                    value={cliente} 
                    onChange={e=>{setCliente(e.target.value)}}
                    placeholder='Cliente...'/>
                <input 
                    value={valor} 
                    onChange={e=>{setValor(e.target.value)}}
                    placeholder='Valor...'/>
                <h3>Vencimento:</h3>
                <Vencimento>
                    <input 
                        value={diaVencimento} 
                        onChange={e=>{setDiaVencimento(e.target.value)}}
                        placeholder='Dia...'/>
                    <input 
                        value={mesVencimento} 
                        onChange={e=>{setMesVencimento(e.target.value)}}
                        placeholder='Mês...'/>
                    <input 
                        value={anoVencimento} 
                        onChange={e=>{setAnoVencimento(e.target.value)}}
                        placeholder='Ano...'/>
                </Vencimento>
                <Botao type="submit">
                    <p>Salvar</p>
                </Botao>
            </form>
            {cobrancaCriada?
                <Sucesso>
                    <p>Cobrança criada!</p>
                </Sucesso>
            :<></>}
      </Tela>
    )
}
const Tela=styled.div`
align-items:center;
flex-direction:column;
form{
display:flex;
    align-items:center;
    flex-direction:column;
}
input{
  width:250px;
  height:40px;
  margin-top:20px;
  border:0;border-radius:10px;
  padding-left:10px;
}
h3{
    width:260px;
}
`
const Vencimento=styled.div`
align-items:center;
width:260px;
justify-content:space-between;
input{
  width:20%;
  margin:0;
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
const Sucesso=styled.div`
width:180px;
height:40px;
align-items:center;
justify-content:center;
background:#43f943;
color:green;
margin-top:20px;
border-radius:10px
`