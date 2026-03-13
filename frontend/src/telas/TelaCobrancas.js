import { useEffect, useState } from 'react';
import { getCobrancas } from '../api';
import styled from 'styled-components'
import Cobranca from '../componentes/Cobranca';
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { Oval } from 'react-loader-spinner';
export default function TelaCobrancas(){
    const [cobrancas,setCobrancas]=useState([])
    const [ordenacao,setOrdenacao]=useState('data_criacao')
    const [crescente,setCrescente]=useState(false)
    const [filtro,setFiltro]=useState('TODOS')
    const [loading,setLoading]=useState(false)
    function alterarOrdenacao(coluna){
        if(ordenacao===coluna){
            setCrescente(!crescente)
        }else{
            setOrdenacao(coluna)
        }
    }
    function buscar(){
        setLoading(true)
        getCobrancas(ordenacao,crescente,filtro).then(res=>{
            setCobrancas(res.data)
            setLoading(false)
        }).catch(err=>{
            setLoading(false)
            console.log(err)
        })
    }
    useEffect(buscar,[ordenacao,crescente,filtro])
    return (
        loading?
        <Tela>
            {loading?<Oval height={150} width={150} color="white" wrapperStyle={{marginTop:'50px'}}/>:<></>}
        </Tela>:
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
                        titulo='Valor' 
                        coluna={'valor'} 
                        alterar={alterarOrdenacao} 
                        ordenacao={ordenacao} 
                        crescente={crescente}
                    />
                    <Ordenacao 
                        titulo='Vencimento' 
                        coluna={'data_vencimento'} 
                        alterar={alterarOrdenacao} 
                        ordenacao={ordenacao} 
                        crescente={crescente}
                    />
                    <Ordenacao 
                        titulo='Recente' 
                        coluna={'data_criacao'} 
                        alterar={alterarOrdenacao} 
                        ordenacao={ordenacao} 
                        crescente={crescente}
                    />
                </Selecoes>
                <Selecoes>
                    <h5>Filtrar por: </h5>
                    <Filtro 
                        titulo='TODOS' 
                        filtro={filtro} 
                        setFiltro={setFiltro} 
                    />
                    <Filtro 
                        titulo='PENDENTE' 
                        filtro={filtro} 
                        setFiltro={setFiltro} 
                    />
                    <Filtro 
                        titulo='PAGO' 
                        filtro={filtro} 
                        setFiltro={setFiltro} 
                    />
                </Selecoes>
            </main>
            </Topo>
            
            <Lista>
                {cobrancas.map(infos=><Cobranca refresh={buscar} infos={infos}/>)}
            </Lista>
        </Tela>
    )
}
function Ordenacao({titulo,coluna,alterar,ordenacao,crescente}){
    return(
        <EscolhaOrdenacao 
            selecionado={ordenacao===coluna} 
            onClick={()=>alterar(coluna)}>
            <p>{titulo}</p>
            {ordenacao===coluna?
                (crescente?<TiArrowSortedDown />:<TiArrowSortedUp />)
            :<></>}
        </EscolhaOrdenacao>
    )
}
function Filtro({titulo,setFiltro,filtro}){
    return(
        <EscolhaFiltro
            selecionado={filtro===titulo} 
            onClick={()=>setFiltro(titulo)}>
            <p>{titulo}</p>
        </EscolhaFiltro>
    )
}
const Topo=styled.div`
background:#3d3c3c;
justify-content:center;
width:100%;
main{
display:flex;
 flex-direction:column;
 max-width:820px;
 width:100%;
}
 h5{
 font-weight:400;
 font-size:14px;
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
align-items:center;
`
const EscolhaFiltro=styled.button`
height:25px;
padding:0 10px 0 10px;
background:${p=>p.selecionado?'black':'#d6d6d6'};
color:${p=>p.selecionado?'white':'black'};
border-radius:13px;
margin-left:10px;
`
const EscolhaOrdenacao=styled.button`
height:25px;
padding:0 10px 0 10px;
background:${p=>p.selecionado?'black':'#d6d6d6'};
color:${p=>p.selecionado?'white':'black'};
border-radius:13px;
margin-left:10px;
font-size:20px;
p{font-size:13px}
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
