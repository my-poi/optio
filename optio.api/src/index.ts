import * as express from 'express';
import { Request, Response } from 'express';
import { Queries } from './queries';
// Routers
import { ShiftsRouter } from './routers/shifts';
// Methods
import { ShiftsMethods } from './methods/shifts';
// Databases
import { System } from './databases/system';
import { WorkTime } from './databases/work-time';

const app: express.Application = express();
const queries = new Queries();
queries.load();
const system = new System();
const workTime = new WorkTime();
const shiftsMethods = new ShiftsMethods(queries, workTime);

app.use('/api/data/shifts', ShiftsRouter);

app.get('/api', (req: Request, res: Response) => {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('Usługi sieciowe Optio');
});

app.listen(8000, () => {
  console.log('Usługi sieciowe Optio zostały uruchomione!');
});

export {
  queries,
  system,
  workTime,
  shiftsMethods
};
