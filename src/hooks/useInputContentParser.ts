import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as C from './constants';
import { apiRequestHandler } from './helpers';
import { getCurrencies, isThereAnyErrorInStore } from '../store/selectors';
import { ApplicationState, CurrenciesState, ErrorType, SingleCurrencyState } from '../store/constants';
import { addCurrencyToStore, addError, removeAllErrors, updateCurrencyPriceInfo } from '../store/actions';

const useInputContentParser = () => {
   const [outputContent, setOutputContent] = useState<string>('');
   const symbolsMarkedAsIncorrect = useRef<string[]>([]);
   const currenciesInStore = useSelector<ApplicationState, CurrenciesState>(getCurrencies);
   const isAnyErrorPresent = useSelector<ApplicationState, boolean>(isThereAnyErrorInStore);
   
   const dispatch = useDispatch();

   const handleIncorrectSymbol = (symbol: string) => {
      dispatch(addError({ errorType: ErrorType.IncorrectArguments, errorMessage: symbol }));
      return C.incorrectArgumentError;
   }

   // If given currency already exists in store return it, otherwise request it from API
   const getCurrencyFromStoreOrAPI = async (symbol: string) => currenciesInStore[symbol]
      ?? apiRequestHandler(`https://api.coinpaprika.com/v1/search?q=${symbol}&c=currencies&modifier=symbol_search&limit=1`)
         .catch((error) => dispatch(addError({ errorType: ErrorType.ApiResponseErrors, errorMessage: error.error })))
         .then((responseAsJSON) => {
            if (responseAsJSON?.currencies?.[0]) {
               dispatch(addCurrencyToStore(responseAsJSON.currencies[0]));
               return responseAsJSON.currencies[0];
            } else {
               symbolsMarkedAsIncorrect.current.push(symbol);
               return handleIncorrectSymbol(symbol);
            }
         });
   
   const getPriceInUSDFromStoreOrAPI = async (symbol: string) => getCurrencyFromStoreOrAPI(symbol)
      .then((currency: SingleCurrencyState) => currency?.id
         ? (currenciesInStore[currency.symbol]?.price
            ? currenciesInStore[currency.symbol]
            : apiRequestHandler(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${currency.id}&quote_currency_id=usd-us-dollars&amount=1`)
               .catch((error) => dispatch(addError({ errorType: ErrorType.ApiResponseErrors, errorMessage: error.error })))
               .then((responseAsJSON) => {
                  dispatch(updateCurrencyPriceInfo(currency.symbol, responseAsJSON));
                  return responseAsJSON;
               })
         ) : currency);
   
   const establishOutputContent = (inputContent: string) => {
      if (isAnyErrorPresent) {
         dispatch(removeAllErrors());
      }

      let capturedMark;
      const functionsToExecute = [];
      
      while ((capturedMark = C.marksMatcher.exec(inputContent)) !== null) {
         const [_inputContent, functionName, argument] = capturedMark;
         const argumentInUpperCase = argument.toUpperCase();

         // If given symbol is already marked as incorrect handle it as error and skip API request
         if (symbolsMarkedAsIncorrect.current.includes(argumentInUpperCase)) {
            functionsToExecute.push(handleIncorrectSymbol(argumentInUpperCase));
            continue;
         }

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
               functionsToExecute.push({});
               dispatch(addError({ errorType: ErrorType.IncorrectFunctions, errorMessage: functionName }));
         }
      }
      
      Promise.all(functionsToExecute).then((functionsResults) => {
         let transformedContent = inputContent;

         functionsResults.forEach((functionResult) => {
            transformedContent = transformedContent.replace(
               C.markReplacementMatcher,
               (_match: string, capturedFunction: string) => functionResult[capturedFunction.toLocaleLowerCase()] ?? C.incorrectFunctionName)
         });

         setOutputContent(transformedContent)
      });
   }

   return {
      outputContent,
      establishOutputContent,
   }
}

export default useInputContentParser;