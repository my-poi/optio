import { Router, Request, Response } from 'express';
import { PeriodDefinitionsMethods } from '../methods/period-definitions.methods';

export class PeriodDefinitionsRouter {
  router = Router();

  constructor(private periodDefinitionsMethods: PeriodDefinitionsMethods) {
    this.router.get('/get-period-definitions', async (request: Request, response: Response) => {
      const results = await this.periodDefinitionsMethods.getPeriodDefinitions();
      response.json(results);
    });
  }
}
