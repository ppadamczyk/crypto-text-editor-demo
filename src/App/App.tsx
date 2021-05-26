import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as P from './parts';
import * as C from './constants';
import { apiRequestHandler, getMarksToReplace } from './helpers';
import { getCurrencies } from '../store/selectors';
import { ErrorType } from '../useErrorHandler/constants';
import useErrorHandler from '../useErrorHandler/useErrorHandler';
import { addCurrencyToStore, updateCurrencyPriceInfo } from '../store/actions';
import { ApplicationState, CurrenciesState, Currency } from '../store/constants';

const App: React.FC = () => {
   const [inputContent, setInputContent] = useState<string>('');
   const [outputContent, setOutputContent] = useState<string>('');
   const symbolsMarkedAsIncorrect = useRef<string[]>([]);
   const currenciesInStore = useSelector<ApplicationState, CurrenciesState | undefined>(getCurrencies);
   
   const dispatch = useDispatch();

   const {
      errorMessages,
      addErrorMessage,
      resetErrorMessages,
      handleIncorrectSymbol,
   } = useErrorHandler();

   const getCurrencyFromStoreOrAPI = async (symbol: string) => {
      // If given symbol is already marked as incorrect handle it as error skipping API request
      if (symbolsMarkedAsIncorrect.current.includes(symbol)) {
         return handleIncorrectSymbol(symbol);
      }

      return currenciesInStore?.[symbol]
         ? currenciesInStore[symbol]
         : apiRequestHandler(`https://api.coinpaprika.com/v1/search?q=${symbol}&c=currencies&modifier=symbol_search&limit=1`)
            .catch((error) => addErrorMessage({ errorType: ErrorType.ApiResponseError, errorMessage: error.error }))
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
      : apiRequestHandler(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${currency.id}&quote_currency_id=usd-us-dollars&amount=1`).catch((error) => addErrorMessage({ errorType: ErrorType.ApiResponseError, errorMessage: error.error }))   
         .then((responseAsJSON) => {
            dispatch(updateCurrencyPriceInfo(currency.symbol, responseAsJSON));
            return responseAsJSON;
         });

   const establishOutputContent = (inputContent: string) => {
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
               addErrorMessage({ errorType: ErrorType.IncorrectFunction, errorMessage: replacementFunction });
               setOutputContent(transformedContent = transformedContent.replace(mark, C.incorrectFunctionName));
         }
      })
   }

   const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      resetErrorMessages();
      setInputContent(e.target.value);
      establishOutputContent(e.target.value);
   }

  return (
    <P.AppWrapper>
      <P.TitleWrapper>
         <P.Title>Cryptocurrency text editor prototype</P.Title>
      </P.TitleWrapper>
      <P.TextAreasWrapper>
         <P.TextArea value={inputContent} onChange={(e) => handleContentChange(e)} />
         <P.TextArea disabled value={outputContent} />
      </P.TextAreasWrapper>
      <P.ErrorLog>
         <P.Header>Error Log</P.Header>
         {errorMessages.incorrectFunction && (
            <P.Paragraph>{`Incorrect functions names: ${errorMessages.incorrectFunction}`}</P.Paragraph>
         )}
         {errorMessages.incorrectArgument && (
            <P.Paragraph>{`Incorrect arguments: ${errorMessages.incorrectArgument}`}</P.Paragraph>
         )}
         {errorMessages.apiResponseError && (
            <P.Paragraph>{`API responded with error: ${errorMessages.apiResponseError}`}</P.Paragraph>
         )}
      </P.ErrorLog>
    </P.AppWrapper>
  );
}

export default App;
