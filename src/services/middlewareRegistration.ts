import {
  makeExecutableSchema,
  ITypeDefinitions,
  IResolvers,
} from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { yupMiddleware } from 'graphql-yup-middleware';

export const schemaWithMiddleware = (
  typeDefs: ITypeDefinitions,
  resolvers?: IResolvers<any> | Array<IResolvers<any>>,
) =>
  applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    yupMiddleware(),
  );
