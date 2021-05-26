import * as C from './constants';

export const addCurrencyToStore = (currency: C.Currency) => ({
   type: C.ActionType.AddCurrencyToStore,
   currency,
});

export const updateCurrencyPriceInfo = (symbol: string, priceInfo: C.CurrencyPriceInfo) => ({
   type: C.ActionType.UpdateCurrencyPriceInfo,
   symbol,
   priceInfo,
});

export const addError = (error: C.Error) => ({
   type: C.ActionType.AddError,
   error,
});

export const removeAllErrors = () => ({
   type: C.ActionType.RemoveAllErrors,
});
