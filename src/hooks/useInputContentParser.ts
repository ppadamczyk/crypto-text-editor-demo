import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as C from './constants';
import { apiRequestHandler, getMarksToReplace } from './helpers';
import { getCurrencies, isThereAnyErrorInStore } from '../store/selectors';
import { addCurrencyToStore, addError, removeAllErrors, updateCurrencyPriceInfo } from '../store/actions';
import { ApplicationState, CurrenciesState, Currency, ErrorType } from '../store/constants';

/*
   This hook encapsulates content parsing logic and optimize it so each cryptocurrency
   is fetched only once* based on symbol given in the editor:
      1. If it was already fetched get it from store.
      2. If not, fetch info from API (use search method due to lack of coins/symbol endpoint).
      3. If there is no such cryptocurrency:
         a) save it as incorrect and never fetch it again.
         b) return error and parse mark as INCORRECT_SYMBOL.
      
   * - once for each method-symbol set.
*/
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

   const getCurrencyFromStoreOrAPI = async (symbol: string) => {
      // If given symbol is already marked as incorrect handle it as error skipping API request
      if (symbolsMarkedAsIncorrect.current.includes(symbol)) {
         return handleIncorrectSymbol(symbol);
      }

      return currenciesInStore?.[symbol]
         ? currenciesInStore[symbol]
         : apiRequestHandler(`https://api.coinpaprika.com/v1/search?q=${symbol}&c=currencies&modifier=symbol_search&limit=1`)
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
   } 

   const getPriceInUSDFromStoreOrAPI = async (currency: Currency) => currenciesInStore?.[currency.symbol]?.price
      ? currenciesInStore[currency.symbol]
      : apiRequestHandler(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${currency.id}&quote_currency_id=usd-us-dollars&amount=1`)
         .catch((error) => dispatch(addError({ errorType: ErrorType.ApiResponseErrors, errorMessage: error.error })))
         .then((responseAsJSON) => {
            dispatch(updateCurrencyPriceInfo(currency.symbol, responseAsJSON));
            return responseAsJSON;
         });

   const establishOutputContent = (inputContent: string) => {
      if (isAnyErrorPresent) {
         dispatch(removeAllErrors());
      }

      let transformedContent = inputContent;
      const marksToReplace = getMarksToReplace(transformedContent);

      // skip mark-transforming logic if there are no marks
      if (!marksToReplace.length) {
         setOutputContent(transformedContent);
         return;
      }

      marksToReplace.forEach((mark) => {
         const textFromMarkMatcher = /{{ ([a-zA-Z]*)\/([a-zA-Z]*) }}/gi;
         const [_mark, replacementFunction, symbol] = textFromMarkMatcher.exec(mark) ?? [];

         switch (replacementFunction.toUpperCase()) {
            case C.SupportedFunctions.Name: {
               getCurrencyFromStoreOrAPI(symbol.toUpperCase())
                  .then((currency) => setOutputContent(transformedContent = transformedContent.replace(mark, currency.name)));
                  break;
            }
            case C.SupportedFunctions.Price: {
               getCurrencyFromStoreOrAPI(symbol.toUpperCase())
                  .then((currency) => currency?.id ? getPriceInUSDFromStoreOrAPI(currency) : currency)
                  .then((currency) => setOutputContent(transformedContent = transformedContent.replace(mark, currency.price)));
                  break;
            }
            default:
               dispatch(addError({ errorType: ErrorType.IncorrectFunctions, errorMessage: replacementFunction }));
               setOutputContent(transformedContent = transformedContent.replace(mark, C.incorrectFunctionName));
         }
      })
   }

   return {
      outputContent,
      establishOutputContent,
   }
}

export default useInputContentParser;