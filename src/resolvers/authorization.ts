import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { isEndpointUser } from '../models/endpoint';

export const isAuthenticated = (_, __, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated.');

export const isEndpointAllowed = async (_, args, { me }) => {
  if (await isEndpointUser(args.id ?? args.input?.id, me.id))
    return skip;
  else throw new ForbiddenError('Not allowed.');
};
