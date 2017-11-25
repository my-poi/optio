import * as express from 'express';
import { Request, Response } from 'express';
// Optio
import { Queries } from './queries';
// Databases
import { System } from './databases/system';
import { WorkTime } from './databases/work-time';
// Methods
import { ShiftsMethods } from './methods/shifts';
// Routers
import { ShiftsRouter } from './routers/shifts';

const app = express();
const queries = new Queries();
const system = new System();
const workTime = new WorkTime();
const shiftsMethods = new ShiftsMethods(queries, workTime);
const shiftsRouter = new ShiftsRouter(shiftsMethods);

app.use('/api/data/shifts', shiftsRouter.router);

app.get('/api', (request: Request, response: Response) => {
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.end('Usługi sieciowe Optio');
});

app.listen(8000, () => {
  console.log('Usługi sieciowe Optio zostały uruchomione!');
});
