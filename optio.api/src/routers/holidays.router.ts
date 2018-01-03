import { Router, Response } from 'express';
import { HolidaysMethods } from '../methods/holidays.methods';

export class HolidaysRouter {
  router = Router();

  constructor(private holidaysMethods: HolidaysMethods) {
    this.router.get('/get-holidays', async ({}, response: Response) => {
      const results = await this.holidaysMethods.getHolidays();
      response.json(results);
    });
  }
}
