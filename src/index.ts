import 'dotenv/config';
import * as express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hi',
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
