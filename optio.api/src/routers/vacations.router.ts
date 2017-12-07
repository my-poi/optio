import { Router, Request, Response } from 'express';
import { VacationsMethods } from '../methods/vacations.methods';

export class VacationsRouter {
  router = Router();

  constructor(private vacationsMethods: VacationsMethods) {
    this.router.get('/get-vacations', async (request: Request, response: Response) => {
      const results = await this.vacationsMethods.getVacations();
      response.json(results);
    });
  }
}
