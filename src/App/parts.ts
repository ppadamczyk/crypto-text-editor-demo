import styled, { css } from 'styled-components';

const commonStyles = css`
   box-shadow: rgb(0, 0, 0, 0.34) 0px 2px 5px 1px;
   border-radius: 4px;
`;

export const AppWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;

export const TextArea = styled.textarea`
   ${commonStyles}
   height: 350px;
   width: 45%;
   opacity: 1;
   padding: 8px;

   :focus-visible {
      outline: none;
   }

   :focus {
      border: 1px solid #0082fa;
   }

   :disabled {
      color: black;
   }
`;

export const TitleWrapper = styled.div`
   ${commonStyles}
   display: flex;
   justify-content: center;
   align-items: center;
   width: 40%;
   height: 50px;
   margin: 20px 0;
`;

export const Title = styled.h1`
   font-weight: normal;
   text-align: center;
`;

export const TextAreasWrapper = styled.div`
   display: flex;
   justify-content: space-evenly;
   width: 80%;
`;

export const Header = styled.h2`
   font-weight: normal;
   margin: 5px 0;
   text-align: center;
`;
