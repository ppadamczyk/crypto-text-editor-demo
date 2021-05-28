import React from 'react';
import * as P from './parts';

interface OutputLogProps {
   value: string;
   isLoading: boolean;
}

const OutputLog: React.FC<OutputLogProps> = ({ value, isLoading }) => (
   <P.OutputLogWrapper>
      <P.TextArea
         disabled
         placeholder={'Output'}
         value={value}
      />
      {isLoading && (
         <P.LoaderOverlay>
            <P.LoaderInfo>{'Loading...'}</P.LoaderInfo>
            <P.Loader />
         </P.LoaderOverlay>
      )}
   </P.OutputLogWrapper>
);

export default OutputLog;