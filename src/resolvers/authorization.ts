import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { isUserEndpoint } from '../models/endpoint';

export const isAuthenticated = (_, __, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated.');

export const isEndpointAllowed = async (_, { id }, { me }) => {
  if (await isUserEndpoint(me.id, id)) return skip;
  else throw new ForbiddenError('Not allowed.');
};
