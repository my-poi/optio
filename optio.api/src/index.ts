import * as express from 'express';
import * as cors from 'cors';
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
const systemDatabase = new SystemDatabase();
const workTimeDatabase = new WorkTimeDatabase();
// Methods
const shiftsMethods = new ShiftsMethods(queries, workTimeDatabase);
// Routers
const shiftsRouter = new ShiftsRouter(shiftsMethods);

app.use(cors());
app.use('/api/data/shifts', shiftsRouter.router);

app.get('/api', (request: Request, response: Response) => {
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.end('Usługi sieciowe Optio');
});

app.listen(8000, () => {
  console.log('Usługi sieciowe Optio zostały uruchomione!');
});
