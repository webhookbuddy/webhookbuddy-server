import { withFilter } from 'apollo-server';
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
import { isEndpointUser } from '../models/endpoint';
import pubSub, { EVENTS } from '../subscriptions';

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

  Subscription: {
    webhookCreated: {
      subscribe: withFilter(
        // it seems that combineResolvers is not allowed here
        () => pubSub.asyncIterator(EVENTS.WEBHOOK.CREATED),

        async (payload, { endpointId }, { me }) =>
          // only double = b/c endpointId is a string while payload.webhookCreated.endpoint.id is a number
          payload.webhookCreated.endpoint.id == endpointId &&
          (await isEndpointUser(endpointId, me.id)),
      ),
    },
  },

  Webhook: {
    forwards: async (webhook, _, { me, loaders }) =>
      await loaders.forward.load({
        userId: me.id,
        webhookId: webhook.id,
      }),
  },
};
