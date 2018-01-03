import { Router, Response } from 'express';
import { HolidayTypesMethods } from '../methods/holiday-types.methods';

export class HolidayTypesRouter {
  router = Router();

  constructor(private holidayTypesMethods: HolidayTypesMethods) {
    this.router.get('/get-holiday-types', async ({}, response: Response) => {
      const results = await this.holidayTypesMethods.getHolidayTypes();
      response.json(results);
    });
  }
}
