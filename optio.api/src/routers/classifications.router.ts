import { Router, Request, Response } from 'express';
import { ClassificationsMethods } from '../methods/classifications.methods';

export class ClassificationsRouter {
  router = Router();

  constructor(private classificationsMethods: ClassificationsMethods) {
    this.router.get('/get-classifications', async (request: Request, response: Response) => {
      const results = await this.classificationsMethods.getClassifications();
      response.json(results);
    });
  }
}
