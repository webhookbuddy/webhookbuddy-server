import 'dotenv/config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as cors from 'cors';
import config from 'config';
import apolloServer from 'config/apolloServer';
import { migrateDB } from 'db/migration';
import ipAddress from 'services/ipAddress';
import processWebhook from 'services/processWebhook';
import { extractContentType } from 'utils/http';

(async function () {
  await migrateDB();
})();

const app = express();
app.use(cors());
apolloServer.applyMiddleware({ app, path: '/graphql' });

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

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
