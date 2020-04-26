import 'dotenv/config';
import * as express from 'express';
const app = express();

app.all('*', (req, res, next) => {
  if (req.subdomains.length === 1 && req.subdomains[0] === 'point')
    req.url = `/point${req.url}`;

  next();
});

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
