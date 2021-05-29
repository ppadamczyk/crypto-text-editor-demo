import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as C from './constants';
import { getCurrencies } from '../store/selectors';
import { addCurrencyToStore, addError, updateCurrencyPriceInfo } from '../store/actions';
import { ApplicationState, CurrenciesState, ErrorType } from '../store/constants';

const useStoreAndAPIHandler = () => {
   const symbolsMarkedAsIncorrect = useRef<string[]>([]);
   const currenciesInStore = useSelector<ApplicationState, CurrenciesState>(getCurrencies);
   const dispatch = useDispatch();

   const apiRequestHandler = (path: string) => fetch(path).then((response) => response.json());

   // If given currency already exists in store return it, otherwise request it from API
   const getCurrencyFromStoreOrAPI = (symbol: string) => {

      // If given symbol is already marked as incorrect handle it as error and skip API request
      if (symbolsMarkedAsIncorrect.current.includes(symbol)) {
         dispatch(addError({ errorType: ErrorType.IncorrectArguments, errorMessage: symbol }));
         return C.incorrectArgumentError;
      }
   
      return currenciesInStore[symbol]
         ?? apiRequestHandler(`https://api.coinpaprika.com/v1/search?q=${symbol}&c=currencies&modifier=symbol_search&limit=1`)
            .catch((error) => dispatch(addError({ errorType: ErrorType.ApiResponseErrors, errorMessage: error.error })))
            .then((responseAsJSON) => {
               if (responseAsJSON?.currencies?.[0]) {
                  dispatch(addCurrencyToStore(responseAsJSON.currencies[0]));
                  return responseAsJSON.currencies[0];
               } else {
                  symbolsMarkedAsIncorrect.current.push(symbol);
                  dispatch(addError({ errorType: ErrorType.IncorrectArguments, errorMessage: symbol }));
                  return C.incorrectArgumentError;
               }
            })
      };
   
   const getPriceInUSDFromStoreOrAPI = (symbol: string) => {
      const currency = getCurrencyFromStoreOrAPI(symbol);

      return currency?.id
         ? (currenciesInStore[currency.symbol]?.price
            ? currenciesInStore[currency.symbol]
            : apiRequestHandler(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${currency.id}&quote_currency_id=usd-us-dollars&amount=1`)
               .catch((error) => dispatch(addError({ errorType: ErrorType.ApiResponseErrors, errorMessage: error.error })))
               .then((responseAsJSON) => {
                  dispatch(updateCurrencyPriceInfo(currency.symbol, responseAsJSON));
                  return responseAsJSON;
               })
         ) : currency;
   }
      
   return {
      getCurrencyFromStoreOrAPI,
      getPriceInUSDFromStoreOrAPI,
   }
}

export default useStoreAndAPIHandler;