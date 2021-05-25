export interface errorMessages {
   incorrectFunction?: string[];
   incorrectArgument?: string[];
   apiResponseError?: string[];
}

export interface error {
   errorType: ErrorType;
   errorMessage: string;
}

export enum ErrorType {
   IncorrectArgument = 'incorrectArgument',
   IncorrectFunction = 'incorrectFunction',
   ApiResponseError = 'apiResponseError',
}

export enum SupportedFunctions {
   Name = 'NAME',
   Price = 'PRICE',
}

export const incorrectArgumentError = { name: 'INCORRECT_SYMBOL', price: 'INCORRECT_SYMBOL' };