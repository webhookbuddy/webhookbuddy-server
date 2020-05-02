import { combineResolvers } from 'graphql-resolvers';
import {
  isAuthenticated,
  isWebhookAllowed,
  isEndpointAllowed,
} from './authorization';
import {
  findById,
  findPage,
  updateRead,
  deleteWebhook,
} from '../models/webhook';

export default {
  Query: {
    webhook: combineResolvers(
      isAuthenticated,
      isWebhookAllowed,
      async (_, { id }, { me }) => await findById(id, me.id),
    ),
    webhooks: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { endpointId, after }, { me }) =>
        await findPage(endpointId, me.id, after),
    ),
  },

  Mutation: {
    readWebhook: combineResolvers(
      isAuthenticated,
      isWebhookAllowed,
      async (_, { input: { id } }, { me }) => {
        await updateRead(id, me.id, true);
        return {
          webhook: await findById(id, me.id),
        };
      },
    ),
    deleteWebhook: combineResolvers(
      isAuthenticated,
      isWebhookAllowed,
      async (_, { input: { id } }) => ({
        affectedRows: await deleteWebhook(id),
      }),
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
