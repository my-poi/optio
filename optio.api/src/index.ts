import * as express from 'express';
import * as cors from 'cors';
import { Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
// Optio
import { queries } from './queries';
import { errors } from './errors';
// Databases
import { OrganizationDatabase } from './databases/organization.database';
import { SystemDatabase } from './databases/system.database';
import { WorkTimeDatabase } from './databases/work-time.database';
// Methods
import { ClassificationsMethods } from './methods/classifications.methods';
import { CompanyUnitsMethods } from './methods/company-units.methods';
import { EmployeesMethods } from './methods/employees.methods';
import { HolidayTypesMethods } from './methods/holiday-types.methods';
import { HolidaysMethods } from './methods/holidays.methods';
import { PeriodDefinitionsMethods } from './methods/period-definitions.methods';
import { PeriodsMethods } from './methods/periods.methods';
import { SchedulesMethods } from './methods/schedules.methods';
import { ShiftsMethods } from './methods/shifts.methods';
import { TokensMethods } from './methods/tokens.methods';
import { VacationsMethods } from './methods/vacations.methods';
// Public routers
import { UsersPublicRouter } from './routers/public/users.public-router';
// Routers
import { StartRouter } from './routers/start.router';
import { ClassificationsRouter } from './routers/classifications.router';
import { CompanyUnitsRouter } from './routers/company-units.router';
import { EmployeesRouter } from './routers/employees.router';
import { HolidayTypesRouter } from './routers/holiday-types.router';
import { HolidaysRouter } from './routers/holidays.router';
import { PeriodDefinitionsRouter } from './routers/period-definitions.router';
import { PeriodsRouter } from './routers/periods.router';
import { SchedulesRouter } from './routers/schedules.router';
import { ShiftsRouter } from './routers/shifts.router';
import { TokenHandlerRouter } from './routers/token-handler.router';
import { VacationsRouter } from './routers/vacations.router';

const app = express();
// Databases
const organizationDatabase = new OrganizationDatabase();
const systemDatabase = new SystemDatabase();
const workTimeDatabase = new WorkTimeDatabase();
// Methods
const classificationsMethods = new ClassificationsMethods(organizationDatabase);
const companyUnitsMethods = new CompanyUnitsMethods(organizationDatabase);
const employeesMethods = new EmployeesMethods(organizationDatabase);
const holidayTypesMethods = new HolidayTypesMethods(workTimeDatabase);
const holidaysMethods = new HolidaysMethods(workTimeDatabase);
const periodDefinitionsMethods = new PeriodDefinitionsMethods(workTimeDatabase);
const periodsMethods = new PeriodsMethods(workTimeDatabase);
const schedulesMethods = new SchedulesMethods(organizationDatabase, workTimeDatabase);
const shiftsMethods = new ShiftsMethods(workTimeDatabase);
const tokensMethods = new TokensMethods();
const vacationsMethods = new VacationsMethods(workTimeDatabase);
// Public routers
const usersPublicRouter = new UsersPublicRouter(tokensMethods);
// Routers
const startRouter = new StartRouter(
  companyUnitsMethods,
  employeesMethods,
  holidayTypesMethods,
  holidaysMethods,
  periodDefinitionsMethods,
  periodsMethods,
  shiftsMethods
);
const classificationsRouter = new ClassificationsRouter(classificationsMethods);
const companyUnitsRouter = new CompanyUnitsRouter(companyUnitsMethods);
const employeesRouter = new EmployeesRouter(employeesMethods);
const holidayTypesRouter = new HolidayTypesRouter(holidayTypesMethods);
const holidaysRouter = new HolidaysRouter(holidaysMethods);
const periodDefinitionsRouter = new PeriodDefinitionsRouter(periodDefinitionsMethods);
const periodsRouter = new PeriodsRouter(periodsMethods);
const schedulesRouter = new SchedulesRouter(schedulesMethods);
const shiftsRouter = new ShiftsRouter(shiftsMethods);
const tokenHandlerRouter = new TokenHandlerRouter();
const vacationsRouter = new VacationsRouter(vacationsMethods);

app.use(cors());
app.use(json({ limit: '1mb' }));
app.use(urlencoded({ limit: '1mb', extended: true }));
app.disable('x-powered-by');

app.use('/api/public/users', usersPublicRouter.router);
app.use('/api/data/', tokenHandlerRouter.router);
app.use('/api/data/start', startRouter.router);
app.use('/api/data/classifications', classificationsRouter.router);
app.use('/api/data/company-units', companyUnitsRouter.router);
app.use('/api/data/employees', employeesRouter.router);
app.use('/api/data/holiday-types', holidayTypesRouter.router);
app.use('/api/data/holidays', holidaysRouter.router);
app.use('/api/data/period-definitions', periodDefinitionsRouter.router);
app.use('/api/data/periods', periodsRouter.router);
app.use('/api/data/schedules', schedulesRouter.router);
app.use('/api/data/shifts', shiftsRouter.router);
app.use('/api/data/vacations', vacationsRouter.router);

app.get('/api', (request: Request, response: Response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Usługi sieciowe Optio');
});

app.listen(8000, () => {
  console.log('Usługi sieciowe Optio zostały uruchomione!');
});
