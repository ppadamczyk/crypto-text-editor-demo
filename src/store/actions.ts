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
