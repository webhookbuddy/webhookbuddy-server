import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isWebhookAllowed } from './authorization';
import { Forward, insert } from '../models/forward';
import { extractContentType } from '../utils/http';
import { findById } from '../models/webhook';
import { KeyValue } from '../models/types';
import pubSub, { EVENTS } from '../subscriptions';
import { findByWebhookId } from '../models/endpoint';
import { User } from '../models/user';
import { throwExpression } from 'utils/throwExpression';

interface AddForwardInput {
  webhookId: string;
  url: string;
  method: string;
  statusCode: number;
  headers: KeyValue[];
  query: KeyValue[];
  body: string;
}

const keyValueToObject = (keyValues: KeyValue[]) =>
  keyValues.reduce((acc: any, cur) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {});

export default {
  Mutation: {
    addForward: combineResolvers(
      isAuthenticated,
      isWebhookAllowed,
      async (
        _,
        { input }: { input: AddForwardInput },
        { me }: { me: User },
      ) => {
        const forward = await insert(
          parseInt(input.webhookId, 10),
          me.id,
          input.url,
          input.method,
          input.statusCode,
          keyValueToObject(input.headers),
          keyValueToObject(input.query),
          extractContentType(keyValueToObject(input.headers)),
          input.body,
        );

        const webhook = await findById(
          forward?.webhookId ?? throwExpression('forward is null'),
        );
        const endpoint = await findByWebhookId(
          webhook?.id ?? throwExpression('webhook is null'),
        );

        pubSub.publish(EVENTS.WEBHOOK.UPDATED, {
          webhookUpdated: {
            webhook,
            endpoint,
          },
        });

        return {
          forward,
          webhook,
        };
      },
    ),
  },
  Forward: {
    user: async (forward: Forward, _: unknown, { loaders }: any) =>
      await loaders.user.load(forward.userId),
  },
};
