export enum SupportedFunctions {
   Name = 'name',
   Price = 'price',
}

export const incorrectFunctionName = 'INCORRECT_FUNCTION';

export const incorrectArgumentError = {
   id: 'INCORRECT_SYMBOL',
   name: 'INCORRECT_SYMBOL',
   price: 'INCORRECT_SYMBOL',
   symbol: 'INCORRECT_SYMBOL',
};

export const marksMatcher = /{{ ([a-z]+)\/([a-z]+) }}/gi;
export const markReplacementMatcher = /{{ ([a-z]+)\/[a-z]+ }}/i;