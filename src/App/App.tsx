import React, { useState } from 'react';
import * as P from './parts';
import ErrorLog from './ErrorLog/ErrorLog';
import OutputLog from './OutputLog/OutputLog';
import useInputContentParser from '../hooks/useInputContentParser';

const App: React.FC = () => {
   const [inputContent, setInputContent] = useState<string>('');
   const { outputContent, isLoading, establishOutputContent } = useInputContentParser()

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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleContentChange(e)}
         />
         <OutputLog value={outputContent} isLoading={isLoading} />
      </P.TextAreasWrapper>
      <ErrorLog />
    </P.AppWrapper>
  );
}

export default App;
