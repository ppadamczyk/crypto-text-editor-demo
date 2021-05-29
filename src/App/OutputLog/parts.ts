import styled from 'styled-components';

export const OutputLogWrapper = styled.div`
   position: relative;
   box-shadow: rgb(0, 0, 0, 0.34) 0px 2px 5px 1px;
   border-radius: 4px;
   height: 366px;
   width: calc(45% + 16px);
   display: flex;

   @media (max-width: 700px) {
      width: 100%;
      height: 150px;
   }
`;

export const TextArea = styled.textarea<{ hasOverlay?: boolean }>`
   height: calc(100% - 16px);
   width: 100%;
   padding: 8px;
   opacity: ${({ hasOverlay }) => hasOverlay ? 0.1 : 1};

   :disabled {
      color: black;
   }
`;

export const LoaderInfo = styled.p``;

export const LoaderOverlay = styled.div`
   height: 100%;
   width: 100%;
   position: absolute;
   top: 0;
   left: 0;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   z-index: 2;
`;

export const Loader = styled.div`
   border: 16px solid white;
   border-top: 16px solid #0082fa;
   border-radius: 50%;
   width: 80px;
   height: 80px;
   animation: spin 2s linear infinite;
   margin-top: 30px;
 
   @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
   }

   @media (max-width: 700px) {
      width: 30px;
      height: 30px;
      margin-top: 10px;
   }
`;
