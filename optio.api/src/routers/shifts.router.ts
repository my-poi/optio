import { Router, Request, Response } from 'express';
import { ShiftsMethods } from '../methods/shifts.methods';

export class ShiftsRouter {
  router = Router();

  constructor(private shiftsMethods: ShiftsMethods) {
    this.router.get('/get-shifts', async (request: Request, response: Response) => {
      const results = await this.shiftsMethods.getShifts();
      response.json(results);
    });
  }
}
