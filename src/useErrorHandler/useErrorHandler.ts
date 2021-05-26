import React, { useState } from 'react';
import * as C from './constants';

const useErrorHandler = () => {
   const [errorMessages, setErrorMessages] = useState<C.errorMessages>({});

   const addErrorMessage = (error: C.error) => setErrorMessages(
      (prevErrorMessages) => ({
         ...prevErrorMessages,
         [error.errorType]: [
            ...(prevErrorMessages?.[error.errorType] ?? []),
            error.errorMessage,
         ],
      })
   );

   const handleIncorrectSymbol = (symbol: string) => {
      addErrorMessage({ errorType: C.ErrorType.IncorrectArgument, errorMessage: symbol });
      return C.incorrectArgumentError;
   }

   return {
      errorMessages,
      addErrorMessage,
      resetErrorMessages: () => setErrorMessages({}),
      handleIncorrectSymbol,
   }
}

export default useErrorHandler;