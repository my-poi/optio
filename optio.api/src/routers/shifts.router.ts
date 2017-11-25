import { Router, Request, Response } from 'express';
import { ShiftsMethods } from '../methods/shifts.methods';

export class ShiftsRouter {
  router = Router();

  constructor(private shiftsMethods: ShiftsMethods) {
    this.router.get('/get-shifts', (request: Request, response: Response) => {
      this.shiftsMethods.getShifts((results: any) => {
        response.json(results);
      });
    });
  }
}
