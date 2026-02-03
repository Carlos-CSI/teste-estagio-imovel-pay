import styled from 'styled-components';

type CardProps = {
     status: 'PENDENTE' | 'PAGO';
};

export const GlobalStyle = styled.div`
     * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
     }

     body {
          background-color: #f5f5f5;
     }
`;

export const Container = styled.div`
     max-width: 1200px;
     margin: 0 auto;
     font-family: 'Inter', sans-serif;
     display: flex;
     flex-direction: column;
     align-items: center;
`;

export const Title = styled.h1`
     font-size: 42px;
     margin: 20px 0;
     text-align: center;
`;

export const Button = styled.button`
     padding: 10px 20px;
     border: none;
     border-radius: 5px;
     background-color: #0077cc;
     color: #fff;
     font-size: 16px;
     cursor: pointer;
     transition: background-color 0.3s ease;

     &:hover {
          background-color: #005fa3;
     }
`;

export const Menu = styled.div`
     display: flex;
     justify-content: space-between;
     align-items: center;
     width: 100%;
     margin: 40px 0;
`;

export const Content = styled.div`
     display: flex;
     flex-direction: column;
     align-items: center;
     background-color: #fff;
     padding: 20px;
     border-radius: 5px;
     width: 40%;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ContentItem = styled.div`
     background-color: #fff;
     padding: 20px;
     border-radius: 5px;
     width: 40%;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     margin-bottom: 10px;
`;

export const Input = styled.input`
     padding: 10px;
     border: 1px solid #ccc;
     border-radius: 5px;
     margin-right: 10px;
     margin-bottom: 10px;
`;

export const Card = styled.div<CardProps>`
     background-color: ${({ status }) => (status === 'PENDENTE' ? '#ffcc00' : '#00cc00')};
     padding: 10px;
     border-radius: 5px;
     margin-bottom: 10px;
`;
