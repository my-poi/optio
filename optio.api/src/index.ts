export {};

import * as express from 'express';
import { Queries } from './queries';

const app = express();
const queries = new Queries();
queries.generate();
console.log(queries.getSql('select-shifts'));

app.get('/api', (req: express.Request, res: express.Response) => {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('Usługi sieciowe Optio');
});

app.listen(8000, () => {
  console.log('Optio API uruchomione!');
});
