import { UserInputError } from 'apollo-server';
import {
  makeExecutableSchema,
  ITypeDefinitions,
  IResolvers,
} from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { yupMiddleware } from 'graphql-yup-middleware';
import { ValidationError } from 'yup';

const formatMessage = (errors: ValidationError[]) =>
  !errors.length
    ? 'Error encountered.'
    : errors.length === 1
    ? `${errors[0].message}.`
    : `${errors.length} Errors: ${errors
        .map((e, i) => `${i + 1}) ${e.message}.`)
        .join(' ')}`;

export const schemaWithMiddleware = (
  typeDefs: ITypeDefinitions,
  resolvers?: IResolvers<any> | Array<IResolvers<any>>,
) =>
  applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    yupMiddleware({
      errorPayloadBuilder: (error: ValidationError) => {
        throw new UserInputError(formatMessage(error.inner));
      },
    }),
  );
