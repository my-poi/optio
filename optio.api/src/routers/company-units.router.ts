import { Router, Request, Response } from 'express';
import { CompanyUnitsMethods } from '../methods/company-units.methods';

export class CompanyUnitsRouter {
  router = Router();

  constructor(private companyUnitsMethods: CompanyUnitsMethods) {
    this.router.get('/get-company-units', async (request: Request, response: Response) => {
      const results = await this.companyUnitsMethods.getCompanyUnits();
      response.json(results);
    });
  }
}
