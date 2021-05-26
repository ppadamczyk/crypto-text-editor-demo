import { combineReducers } from 'redux';
import * as C from './constants';

const currenciesReducer = (state: C.CurrenciesState = C.initialState.currencies, action: C.Action) => {
   switch (action.type) {
      case C.ActionType.AddCurrencyToStore: {
         return action.currency?.symbol
            ? {
               ...state,
               [action.currency.symbol]: {
                  ...(state?.[action.currency.symbol] ?? {}),
                  ...action.currency,
               }
            } : state
      }
      case C.ActionType.UpdateCurrencyPriceInfo: {
         return {
            ...state,
            [action.symbol]: {
               ...(state?.[action.symbol] ?? {}),
               ...action.priceInfo,
            }
         }
      }
      default:
         return state
   }
}

const errorsReducer = (state: C.ErrorsState = C.initialState.errors, action: C.Action) => {
   switch (action.type) {
      case C.ActionType.AddError: {
         const { error } = action;
            return {
               ...state,
               [error.errorType]: [
                  ...(state[error.errorType] ?? []),
                  error.errorMessage,
               ],
            };
      }
      case C.ActionType.RemoveAllErrors: {
         return C.initialState.errors;
      }
      default:
         return state
   }
}

export default combineReducers({
   currencies: currenciesReducer,
   errors: errorsReducer,
});