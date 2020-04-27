import 'dotenv/config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import processWebhook from './services/processWebhook';

const app = express();
app.use(bodyParser.text({ type: '*/*' }));

app.all('*', (req, res, next) => {
  if (req.subdomains.length === 1 && req.subdomains[0] === 'point')
    req.url = `/point${req.url}`;

  next();
});

app.all('/point/*', async (req, res) => {
  try {
    const body =
      Object.keys(req.body).length === 0 &&
      req.body.constructor === Object
        ? null
        : req.body;

    // bodyParser sets req.body to an empty object if there's no body
    await processWebhook({
      referenceId: req.params[0],
      ipAddress: (
        <string>req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        ''
      )
        .split(',')[0]
        .trim(),
      method: req.method,
      contentType: req.headers['content-type'],
      headers: req.headers,
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

app.get('/', (req, res) => {
  res.json({
    message: 'Hi',
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
