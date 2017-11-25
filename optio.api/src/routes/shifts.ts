import { Router, Request, Response } from 'express';
import * as index from '../index';

const router = Router();

router.get('/get-shifts', (request: Request, response: Response) => {
  index.shiftsMethods.getShifts((results: any) => {
    response.json(results);
  });
});

export const ShiftsRouter: Router = router;
