// https://stackoverflow.com/a/65666402/188740

import { UserInputError } from 'apollo-server';

export function throwExpression<T>(
  errorMessage: string = 'Invalid Operation',
): T {
  throw new Error(errorMessage);
}

export function throwUserInputExpression<T>(
  errorMessage: string = 'Invalid Operation',
): T {
  throw new UserInputError(errorMessage);
}
