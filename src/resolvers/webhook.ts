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

  Webhook: {
    forwards: async (webhook, _, { me, loaders }) =>
      await loaders.forward.load({
        userId: me.id,
        webhookId: webhook.id,
      }),
  },
};
