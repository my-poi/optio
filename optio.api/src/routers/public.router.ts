import { Router, Request, Response } from 'express';
import { TokensMethods } from '../methods/tokens.methods';
import { errors } from '../errors';

export class PublicRouter {
  router = Router();

  constructor(public tokensMethods: TokensMethods) {
    this.router.post('/login', async (request: Request, response: Response) => {
      const userName = request.body.userName;
      const password = request.body.password;
      if (!password || !userName) return response.status(401).send(errors[1]);
      const userIp = String(request.headers['x-real-ip']);

      // proces logowania użytkownika da w efekcie:
      const userId = 2;

      const token = tokensMethods.issueToken(userId, 'm.tokarz', userIp);
      return response.json({token: token, userId: userId });
    });
  }
}
