import { Router, Request, Response } from 'express';
import { HolidaysMethods } from '../methods/holidays.methods';

export class HolidaysRouter {
  router = Router();

  constructor(private holidaysMethods: HolidaysMethods) {
    this.router.get('/get-holidays', async (request: Request, response: Response) => {
      const results = await this.holidaysMethods.getHolidays();
      response.json(results);
    });
  }
}
