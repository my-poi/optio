import { Router, Request, Response } from 'express';
import { SchedulesMethods } from '../methods/schedules.methods';

export class SchedulesRouter {
  router = Router();

  constructor(private schedulesMethods: SchedulesMethods) {
    this.router.post('/add-schedule', async (request: Request, response: Response) => {
      const results = await this.schedulesMethods.addSchedule(request);
      response.json(results);
    });
  }
}
