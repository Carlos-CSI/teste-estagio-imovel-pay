import styled from 'styled-components'
export default function Cliente({infos,refresh}){
    const {cliente,pendencias,valor_total}=infos
    function alterarStatus(){
        
    }
    return (
        <Infos>
            <section>
                <Etiqueta>
                    <h6>Cliente:</h6>
                    <p>{cliente}</p>
                </Etiqueta>
                <Etiqueta>
                    <h6>Pendencias:</h6>
                    <p>{pendencias}</p>
                </Etiqueta>
                <Etiqueta>
                    <h6>Valor total:</h6>
                    <p>R$ {valor_total}</p>
                </Etiqueta>
            </section>
            <aside>
                <Botao onClick={alterarStatus}>
                    <p>Quitar todas</p>
                </Botao>
            </aside>
        </Infos>
    )
}
const Etiqueta=styled.div`
min-height:25px;
background:white;
align-items:center;
p{
  margin:0;
  font-size:15px;
}
h6{
    text-align: right;
  margin:0 10px 0 0;
  font-weight:400;
  color:gray;
  width:60px;
}
@media(min-width:850px){
    width:180px;
}
`
const Botao=styled.button`
width:120px;
height:35px;
background:black;
color:white;
border-radius:10px
`
const Infos=styled.div`
margin-top:15px;
width:calc(100% - 30px);
max-width:820px;
min-height:90px;
justify-content:space-between;
background:white;
border-radius:10px;
padding:10px;
section{
    display:flex;
    flex-direction:column;
}
aside{
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    height:75px;
    justify-content:space-between;
}
@media(min-width:850px){
    min-height:50px;
    section{
        flex-direction:row;
    }
    aside{
        height:40px;
        flex-direction: row-reverse;
        align-items:center;
        gap:10px;
    }
}
`