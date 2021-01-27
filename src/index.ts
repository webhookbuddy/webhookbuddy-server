import 'dotenv/config';
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import config from 'config';
import apolloServer from 'config/apolloServer';
import pointRoutes from 'config/pointRoutes';
import { migrateDB } from 'db/migration';

(async function () {
  await migrateDB();
})();

const app = express();
app.use(cors());
apolloServer.applyMiddleware({ app, path: '/graphql' });
pointRoutes(app);

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
