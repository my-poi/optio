import * as express from 'express';
import { Request, Response } from 'express';
// Optio
import { Queries } from './queries';
// Databases
import { SystemDatabase } from './databases/system.database';
import { WorkTimeDatabase } from './databases/work-time.database';
// Methods
import { ShiftsMethods } from './methods/shifts.methods';
// Routers
import { ShiftsRouter } from './routers/shifts.router';

const app = express();
const queries = new Queries();
// Databases
const system = new SystemDatabase();
const workTime = new WorkTimeDatabase();
// Methods
const shiftsMethods = new ShiftsMethods(queries, workTime);
// Routers
const shiftsRouter = new ShiftsRouter(shiftsMethods);

app.use('/api/data/shifts', shiftsRouter.router);

app.get('/api', (request: Request, response: Response) => {
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.end('Usługi sieciowe Optio');
});

app.listen(8000, () => {
  console.log('Usługi sieciowe Optio zostały uruchomione!');
});
