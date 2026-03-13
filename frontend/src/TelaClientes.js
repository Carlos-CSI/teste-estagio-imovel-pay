import { useEffect, useState } from 'react';
import { getClientes, } from './api';
import styled from 'styled-components'
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import Cliente from './Cliente';
export default function TelaClientes(){
    const [clientes,setClientes]=useState([])
    const [ordenacao,setOrdenacao]=useState('cliente')
    const [crescente,setCrescente]=useState(true)
    function alterarOrdenacao(coluna){
        if(ordenacao===coluna){
            setCrescente(!crescente)
        }else{
            setOrdenacao(coluna)
        }
    }
    function buscar(){
        getClientes(ordenacao,crescente).then(res=>{
            setClientes(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    useEffect(buscar,[ordenacao,crescente])
    return (
        <Tela>
            <Topo>
            <main>
                <Selecoes>
                    <h5>Ordenar por: </h5>
                    <Ordenacao 
                        titulo='Cliente' 
                        coluna={'cliente'} 
                        alterar={alterarOrdenacao} 
                        ordenacao={ordenacao} 
                        crescente={crescente}
                    />
                    <Ordenacao 
                        titulo='Valor Pendente' 
                        coluna={'valor_total'} 
                        alterar={alterarOrdenacao} 
                        ordenacao={ordenacao} 
                        crescente={crescente}
                    />
                </Selecoes>
            </main>
            </Topo>
            <Lista>
                {clientes.map(infos=><Cliente refresh={buscar} infos={infos}/>)}
            </Lista>
        </Tela>
    )
}
function Ordenacao({titulo,coluna,alterar,ordenacao,crescente}){
    return(
        <EscolhaOrdenacao onClick={()=>alterar(coluna)}>
            <p>{titulo}</p>
            {ordenacao===coluna?
                (crescente?<TiArrowSortedDown />:<TiArrowSortedUp />)
            :<></>}
        </EscolhaOrdenacao>
    )
}

const Topo=styled.div`
background:black;
justify-content:center;
main{
display:flex;
 flex-direction:column;
 max-width:820px;
 width:100%;
}
@media(min-width:850px){
main{
    flex-direction:row;
    justify-content:space-between;
}
}
`
const Tela=styled.div`
flex-direction:column;
overflow:auto;
height:100%;
`
const EscolhaOrdenacao=styled.button`
height:25px;
padding:0 10px 0 10px;
background:#d6d6d6;
border-radius:13px;
margin-left:10px;
`
const Selecoes=styled.div`
align-items:center;
height:40px;
color:white;
padding:0 20px 0 20px;
`
const Lista=styled.div`
width:100%;
height:calc(100% - 40px);
align-items:center;
flex-direction:column;
overflow:auto;
padding-bottom:20px;
`
