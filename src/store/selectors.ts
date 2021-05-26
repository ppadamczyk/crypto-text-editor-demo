import { ApplicationState } from "./constants";

export const getCurrencies = (state: ApplicationState) => state.currencies;

export const getErrors = (state: ApplicationState) => state.errors;
