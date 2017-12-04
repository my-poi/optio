import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { Config } from '../config';

export class TokenHandler {
  router = Router();
  config = new Config();

  constructor() {
    this.router.get('/', async (request: Request, response: Response, next: NextFunction) => {
      const token: any = request.headers.token;
      if (token) {
        jwt.verify(token, this.config.secretKey, (error: any, decoded: any) => {
          if (error) return response.status(401).send({success: false, message: 'Failed to authenticate token.', errorCode: '0001'});
          next();
        });
      } else response.status(401).send({success: false, message: 'No token provided.', errorCode: '0003'});
    });
  }
}
