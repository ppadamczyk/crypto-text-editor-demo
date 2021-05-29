import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as C from './constants';
import useStoreAndAPIHandler from './useStoreAndAPIHandler';
import { isThereAnyErrorInStore } from '../store/selectors';
import { addError, removeAllErrors } from '../store/actions';
import { ApplicationState, ErrorType } from '../store/constants';

const useInputContentParser = () => {
   const [outputContent, setOutputContent] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const isAnyErrorPresent = useSelector<ApplicationState, boolean>(isThereAnyErrorInStore);

   const throttle = useRef<NodeJS.Timer>();
   
   const dispatch = useDispatch();
   const { getCurrencyFromStoreOrAPI, getPriceInUSDFromStoreOrAPI } = useStoreAndAPIHandler();

   const establishOutputContent = (inputContent: string) => {
      if (!isLoading) {
         setIsLoading(true);
      }

      if (throttle.current) {
         clearTimeout(throttle.current);
      }

      // Throttle used to delay parsing until user stop typing
      throttle.current = global.setTimeout(() => {
         if (isAnyErrorPresent) {
            dispatch(removeAllErrors());
         }

         parseInputContent(inputContent);
      }, 250);
   };

   const parseInputContent = (inputContent: string) => {
      let capturedMark;
      const functionsToExecute = [];
      
      while ((capturedMark = C.marksMatcher.exec(inputContent)) !== null) {
         const [_inputContent, functionName, argument] = capturedMark;
         const argumentInUpperCase = argument.toUpperCase();

         switch (functionName.toLocaleLowerCase()) {
            case C.SupportedFunctions.Name: {
               functionsToExecute.push(getCurrencyFromStoreOrAPI(argumentInUpperCase));
               break;
            }
            case C.SupportedFunctions.Price: {
               functionsToExecute.push(getPriceInUSDFromStoreOrAPI(argumentInUpperCase));
               break;
            }
            default:
               functionsToExecute.push({ [functionName.toLocaleLowerCase()]: C.incorrectFunctionName});
               dispatch(addError({ errorType: ErrorType.IncorrectFunctions, errorMessage: functionName }));
         }
      }
      
      Promise.all(functionsToExecute).then((functionsResults) => {
         let transformedContent = inputContent;

         functionsResults.forEach((functionResult) => {
            transformedContent = transformedContent.replace(
               C.markReplacementMatcher,
               (_match: string, capturedFunction: string) => functionResult[capturedFunction.toLocaleLowerCase()])
         });

         setOutputContent(transformedContent)
         setIsLoading(false);
      });
   }

   return {
      outputContent,
      isLoading,
      establishOutputContent,
   }
}

export default useInputContentParser;