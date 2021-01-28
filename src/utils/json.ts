import { throwExpression } from './throwExpression';

export const isJSON = (json: string | undefined | null) => {
  try {
    JSON.parse(json ?? throwExpression());
    return true;
  } catch (error) {
    return false;
  }
};
