export interface ApplicationState {
   currencies: CurrenciesState;
   errors: ErrorsState;
}

export interface ErrorsState {
   incorrectFunctions?: string[];
   incorrectArguments?: string[];
   apiResponseErrors?: string[];
}

export interface Error {
   errorType: ErrorType;
   errorMessage: string;
}

export enum ErrorType {
   IncorrectArguments = 'incorrectArguments',
   IncorrectFunctions = 'incorrectFunctions',
   ApiResponseErrors = 'apiResponseErrors',
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

export const initialState: ApplicationState = {
   currencies: {},
   errors: {},
};

type SingleCurrencyState = Currency & CurrencyPriceInfo;

export enum ActionType {
   AddCurrencyToStore = 'ADD_CURRENCY_TO_STORE',
   UpdateCurrencyPriceInfo = 'UPDATE_CURRENCY_PRICE_INFO',
   AddError = 'ADD_ERROR',
   RemoveAllErrors = 'REMOVE_ALL_ERRORS',
}

export type Action = {
   type: ActionType.AddCurrencyToStore;
   currency: Currency;
} | {
   type: ActionType.UpdateCurrencyPriceInfo;
   symbol: string;
   priceInfo: CurrencyPriceInfo;
} | {
   type: ActionType.AddError;
   error: Error;
} | {
   type: ActionType.RemoveAllErrors;
};
