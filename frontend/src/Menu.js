import { useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"
export function Menu(){
    const navigate=useNavigate()
    const {pathname}=useLocation()
    return (
        <Tela>
        <BotaoNavegacao 
            selecionado={pathname=='/'} 
            onClick={()=>navigate('/')}
            >
            <p>Cobranças</p>
        </BotaoNavegacao>
        <BotaoNavegacao 
            selecionado={pathname=='/nova-cobranca'} 
            onClick={()=>navigate('/nova-cobranca')}
            >
            <p>Nova cobrança</p>
        </BotaoNavegacao>
      </Tela>
    )
}
const Tela=styled.div`
align-items:center;
justify-content:space-between;
height:60px;
background:#444444;
padding:10px;
`
const BotaoNavegacao=styled.button`
width:150px;
height:40px;
color:${p=>p.selecionado?'darkgray':'white'};
background:transparent;
border-radius:10px
`