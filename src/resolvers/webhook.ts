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
  deleteWebhooks,
} from '../models/webhook';
import {
  isEndpointUser,
  findById as findEndpointById,
  findByWebhookId as findEndpointByWebhookId,
} from '../models/endpoint';
import pubSub, { EVENTS } from '../subscriptions';

const subscribeWithFilter = (
  subscriptionName: string,
  eventName: string,
) =>
  withFilter(
    // it seems that combineResolvers is not allowed here
    () => pubSub.asyncIterator(eventName),

    async (payload, { endpointId }, { me }) =>
      // only double = (== instead of ===) b/c endpointId is a string while payload.webhookCreated.endpoint.id is a number
      payload[subscriptionName].endpoint.id == endpointId &&
      (await isEndpointUser(endpointId, me.id)),
  );

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

        const webhook = await findById(id, me.id);
        const endpoint = await findEndpointByWebhookId(webhook.id);

        pubSub.publish(EVENTS.WEBHOOK.UPDATED, {
          webhookUpdated: {
            webhook,
            endpoint,
          },
        });

        return {
          webhook: await findById(id, me.id),
        };
      },
    ),
    deleteWebhooks: combineResolvers(
      isAuthenticated,
      async (_, { input: { webhookIds, endpointId } }, { me }) => {
        const affectedRows = await deleteWebhooks(
          me.id,
          endpointId,
          webhookIds,
        );

        const endpoint = await findEndpointById(endpointId);

        pubSub.publish(EVENTS.WEBHOOK.DELETED, {
          webhooksDeleted: {
            affectedRows,
            webhookIds,
            endpoint,
          },
        });

        return {
          affectedRows,
          webhookIds,
        };
      },
    ),
  },

  Subscription: {
    webhookCreated: {
      subscribe: subscribeWithFilter(
        'webhookCreated',
        EVENTS.WEBHOOK.CREATED,
      ),
    },
    webhookUpdated: {
      subscribe: subscribeWithFilter(
        'webhookUpdated',
        EVENTS.WEBHOOK.UPDATED,
      ),
    },
    webhooksDeleted: {
      subscribe: subscribeWithFilter(
        'webhooksDeleted',
        EVENTS.WEBHOOK.DELETED,
      ),
    },
  },

  Webhook: {
    reads: async (webhook, _, { loaders }) =>
      await loaders.read.load({
        webhookId: webhook.id,
      }),
    forwards: async (webhook, _, { me, loaders }) =>
      await loaders.forward.load({
        webhookId: webhook.id,
      }),
  },
};
