import * as C from './constants';

export const rootReducer = (state: C.ApplicationState = C.initialState, action: C.Action) => {
   switch (action.type) {
      case C.ActionType.AddCurrencyToStore: {
         return action.currency?.symbol
            ? {
               currencies: {
                  ...state.currencies,
                  [action.currency.symbol]: {
                     ...(state.currencies?.[action.currency.symbol] ?? {}),
                     ...action.currency,
                  },
               }
            } : state
      }
      case C.ActionType.UpdateCurrencyPriceInfo: {
         return {
            currencies: {
               ...state.currencies,
               [action.symbol]: {
                  ...(state.currencies?.[action.symbol] ?? {}),
                  ...action.priceInfo,
               },
            }
         }
      }
      default:
         return state
   }
}