import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { User } from '../types';

export const isAuthenticated = (_, __, { me }: { me: User }) =>
  me ? skip : new ForbiddenError('Not authenticated.');
