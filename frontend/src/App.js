import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components'
import TelaCriacao from './telas/TelaCriacao';
import TelaCobrancas from './telas/TelaCobrancas';
import { Menu } from './telas/Menu';
import TelaClientes from './telas/TelaClientes';

function App() {
  
  return (
    <BrowserRouter>
      <Tela>
        <Menu/>
          <Routes>
            <Route path='/nova-cobranca' element={<TelaCriacao/>}/>
            <Route path='/' element={<TelaCobrancas/>}/>
            <Route path='/pendencias-clientes' element={<TelaClientes/>}/>
          </Routes>
      </Tela>
    </BrowserRouter>
  );
}
const Tela=styled.div`
width:100vw;
height:100vh;
display:flex;
background:gray;
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

`

export default App;
