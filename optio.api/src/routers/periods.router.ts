import { Router, Request, Response } from 'express';
import { PeriodsMethods } from '../methods/periods.methods';

export class PeriodsRouter {
  router = Router();

  constructor(private periodsMethods: PeriodsMethods) {
    this.router.get('/get-periods', async (request: Request, response: Response) => {
      const results = await this.periodsMethods.getPeriods();
      response.json(results);
    });
  }
}
