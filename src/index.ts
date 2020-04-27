import 'dotenv/config';
import * as express from 'express';
import subdomainMiddleware from './middlewares/subdomainMiddleware';
const app = express();

app.use(subdomainMiddleware);

app.all('/point/*', (req, res) => {
  res.json({
    url: req.url,
    method: req.method,
    route: req.params[0],
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hi',
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
