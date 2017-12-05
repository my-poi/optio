import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { errors } from '../errors';

export class TokenHandlerRouter {
  router = Router();

  constructor() {
    this.router.get('/', async (request: Request, response: Response, next: NextFunction) => {
      const token: any = request.headers.token;
      if (token) {
        jwt.verify(token, config.secretKey, (error: any, decoded: any) => {
          if (error) return response.status(401).send(errors[3]);
          next();
        });
      } else response.status(401).send(errors[2]);
    });
  }
}
