import 'dotenv/config';
import { migrateDB } from './db/migration';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import * as DataLoader from 'dataloader';
import { findByKeys as findForwardsByKeys } from './models/forward';
import { findByIds as findUsersByIds } from './models/user';
import ipAddress from './services/ipAddress';
import processWebhook from './services/processWebhook';
import { getMe, getSubscriber } from './services/me';
import { extractContentType } from './utils/http';

(async function () {
  await migrateDB();
})();

const app = express();

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
      forward: new DataLoader(
        (keys: { webhookId: number }[]) => findForwardsByKeys(keys),
        {
          cacheKeyFn: key => key.webhookId,
        },
      ),
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
        jwtSecret: process.env.JWT_SECRET,
        loaders,
      };
  },
});
server.applyMiddleware({ app, path: '/graphql' });

// make sure bodyParser gets registered as middleware after graphql
app.use(bodyParser.text({ type: '*/*' }));

app.all('*', (req, res, next) => {
  if (req.subdomains.length === 1 && req.subdomains[0] === 'point')
    req.url = `/point${req.url}`;

  next();
});

app.all('/point/*', async (req, res) => {
  try {
    // bodyParser sets req.body to an empty object if there's no body
    await processWebhook({
      referenceId: req.params[0],
      ipAddress: ipAddress(req),
      method: req.method,
      contentType: extractContentType(req.headers),
      rawHeaders: req.rawHeaders, // use rawHeaders instead of headers, as headers converts all keys to lower-case: https://github.com/nodejs/node-v0.x-archive/issues/1954
      query: req.query,
      body: typeof req.body === 'string' ? req.body : null, // Note: won't work if string is constructed from new String(): https://stackoverflow.com/a/4059166/188740
    });
    res.status(204).send(undefined);
  } catch (error) {
    res
      .status(400)
      .json((({ message, code }) => ({ message, code }))(error));
  }
});

const PORT = process.env.PORT || 8000; // Heoku sets process.env.PORT
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
