import { UserInputError } from 'apollo-server';
import {
  makeExecutableSchema,
  ITypeDefinitions,
  IResolvers,
} from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { yupMiddleware } from 'graphql-yup-middleware';
import { ValidationError } from 'yup';

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
        throw new UserInputError(
          `${error.inner.length} Error${
            error.inner.length > 1 ? 's' : ''
          }: ${error.inner
            .map((e, i) => `${i + 1}) ${e.message}.`)
            .join(' ')}`,
        );
      },
    }),
  );
