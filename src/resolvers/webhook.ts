import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isWebhookAllowed } from './authorization';
import { findById } from '../models/webhook';

export default {
  Query: {
    webhook: combineResolvers(
      isAuthenticated,
      isWebhookAllowed,
      async (_, { id }) => await findById(id),
    ),
  },
};
