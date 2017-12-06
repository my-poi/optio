import { Router, Request, Response } from 'express';
import { SchedulesMethods } from '../methods/schedules.methods';

export class SchedulesRouter {
  router = Router();

  constructor(private schedulesMethods: SchedulesMethods) {
    this.router.get('/get-schedules/:year/:month', async (request: Request, response: Response) => {
      const results = await this.schedulesMethods.getSchedules(request);
      response.json(results);
    });
    this.router.post('/add-schedule', async (request: Request, response: Response) => {
      const results = await this.schedulesMethods.addSchedule(request);
      response.json(results);
    });
  }
}
