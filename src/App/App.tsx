import React, { useState } from 'react';
import * as P from './parts';
import ErrorLog from './ErrorLog/ErrorLog';
import useInputContentParser from '../hooks/useInputContentParser';

const App: React.FC = () => {
   const [inputContent, setInputContent] = useState<string>('');
   const { outputContent, establishOutputContent } = useInputContentParser();

   const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputContent(e.target.value);
      establishOutputContent(e.target.value);
   }

  return (
    <P.AppWrapper>
      <P.TitleWrapper>
         <P.Title title={'CryptoEditorDemo'}>CryptoEditorDemo</P.Title>
      </P.TitleWrapper>
      <P.TextAreasWrapper>
         <P.TextArea
            placeholder={'Input'}
            value={inputContent}
            onChange={(e) => handleContentChange(e)}
         />
         <P.TextArea
            disabled
            placeholder={'Output'}
            value={outputContent}
         />
      </P.TextAreasWrapper>
      <ErrorLog />
    </P.AppWrapper>
  );
}

export default App;
