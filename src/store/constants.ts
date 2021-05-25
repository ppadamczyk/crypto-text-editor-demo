export interface ApplicationState {
   currencies: CurrenciesState;
}

export interface CurrenciesState {
   [symbol: string]: SingleCurrencyState;
}

export interface Currency {
   id: string;
   name: string,
   symbol: string,
   rank?: number,
   is_new?: boolean,
   is_active?: boolean,
   type?: string,
}

export interface CurrencyPriceInfo {
   base_currency_id?: string;
   base_currency_name?: string;
   base_price_last_updated?: string;
   quote_currency_id?: string;
   quote_currency_name?: string;
   quote_price_last_updated?: string;
   amount?: number;
   price?: number;
}

export const initialState: ApplicationState = { currencies: {} };

type SingleCurrencyState = Currency & CurrencyPriceInfo;

export enum ActionType {
   AddCurrencyToStore = 'ADD_CURRENCY_TO_STORE',
   UpdateCurrencyPriceInfo = 'UPDATE_CURRENCY_PRICE_INFO',
}

export type Action = {
   type: ActionType.AddCurrencyToStore;
   currency: Currency;
} | {
   type: ActionType.UpdateCurrencyPriceInfo;
   symbol: string;
   priceInfo: CurrencyPriceInfo;
};
