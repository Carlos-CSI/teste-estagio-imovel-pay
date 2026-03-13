import { useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"
export function Menu(){
    return (
        <Tela>
            <main>
                <Navegacao
                    titulo="Lista cobranças"
                    path={'/'}
                />
                <Navegacao
                    titulo="Nova cobrança"
                    path={'/nova-cobranca'}
                />
            </main>
      </Tela>
    )
}
function Navegacao({titulo,path}){
    const navigate=useNavigate()
    const {pathname}=useLocation()
    return(
        <BotaoNavegacao 
            selecionado={pathname===path} 
            onClick={()=>navigate(path)}
            >
            <p>{titulo}</p>
        </BotaoNavegacao>
    )
}
const Tela=styled.div`
align-items:center;
justify-content:center;
height:60px;
background:#444444;
padding:10px;
main{
max-width:820px;
width:100%;
display:flex;
align-items:center;
justify-content:space-between;
}
`
const BotaoNavegacao=styled.button`
width:150px;
height:40px;
color:${p=>p.selecionado?'white':'darkgray'};
background:transparent;
border-radius:10px
`