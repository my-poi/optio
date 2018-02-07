import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { errors } from '../errors';

export class TokenHandlerRouter {
  router = Router();

  constructor() {
    this.router.post('*', async (request: Request, response: Response, next: NextFunction) => {
      this.verifyToken(request, response, next);
    });
    this.router.get('*', async (request: Request, response: Response, next: NextFunction) => {
      this.verifyToken(request, response, next);
    });
    this.router.put('*', async (request: Request, response: Response, next: NextFunction) => {
      this.verifyToken(request, response, next);
    });
    this.router.delete('*', async (request: Request, response: Response, next: NextFunction) => {
      this.verifyToken(request, response, next);
    });
  }

  verifyToken(request: Request, response: Response, next: NextFunction) {
    const token: any = request.headers.token;
    if (token) {
      jwt.verify(token, config.secretKey, (error: any, decoded: any) => {
        if (error) response.status(401).send(errors[3]);
        else {
          request.body.decoded = decoded;
          next();
        }
      });
    } else response.status(401).send(errors[2]);
  }
}
