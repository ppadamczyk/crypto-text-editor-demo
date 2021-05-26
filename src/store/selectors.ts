import { ApplicationState } from "./constants";

export const getCurrencies = (state: ApplicationState) => state.currencies;

export const getErrors = (state: ApplicationState) => state.errors;

export const isThereAnyErrorInStore = (state: ApplicationState) => {
   const errors = getErrors(state);

   return !!(errors.apiResponseErrors || errors.incorrectArguments || errors.incorrectFunctions);
};
