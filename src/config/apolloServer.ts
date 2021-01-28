import config from 'config';
import { ApolloServer } from 'apollo-server-express';
import schema from 'schema';
import resolvers from 'resolvers';
import DataLoader from 'dataloader';
import ipAddress from 'services/ipAddress';
import { findByKeys as findReadsByKeys } from 'models/read';
import { findByKeys as findForwardsByKeys } from 'models/forward';
import { findByIds as findUsersByIds } from 'models/user';
import { getMe, getSubscriber } from 'services/me';

const server = new ApolloServer({
  introspection: true, // enable for Heroku
  playground: true, // enable in Heroku
  typeDefs: schema,
  resolvers,
  subscriptions: {
    onConnect: async connectionParams => ({
      me: await getSubscriber(connectionParams),
    }),
  },
  formatError: error => ({
    // If an exception is thrown during context creation, 'Context creation failed: ' is prepended to the error message.
    ...error,
    message: error.message.replace('Context creation failed: ', ''),
  }),
  context: async ({ req, connection }) => {
    const loaders = {
      read: new DataLoader(
        // @ts-ignore TODO: fix type
        (keys: { webhookId: number }[]) => findReadsByKeys(keys),
        {
          cacheKeyFn: key => key.webhookId,
        },
      ),
      forward: new DataLoader(
        // @ts-ignore TODO: fix type
        (keys: { webhookId: number }[]) => findForwardsByKeys(keys),
        {
          cacheKeyFn: key => key.webhookId,
        },
      ),
      // @ts-ignore TODO: fix type
      user: new DataLoader((ids: number[]) => findUsersByIds(ids)),
    };

    // subscription websocket request
    if (connection)
      return {
        ...connection.context, // connection.context contains what's been returned from `onConnect` above (e.g. {me:{}})
        loaders,
      };

    // http request
    if (req)
      return {
        me: await getMe(req, ipAddress(req)),
        ipAddress: ipAddress(req),
        jwtSecret: config.jwt.secret,
        loaders,
      };
  },
});

export default server;
