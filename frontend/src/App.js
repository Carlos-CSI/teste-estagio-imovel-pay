import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components'
import TelaCriacao from './TelaCriacao';
import TelaCobrancas from './TelaCobrancas';
import { Menu } from './Menu';

function App() {
  
  return (
    <BrowserRouter>
      <Tela>
        <Menu/>
          <Routes>
            <Route path='/' element={<TelaCobrancas/>}/>
            <Route path='/nova-cobranca' element={<TelaCriacao/>}/>
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
