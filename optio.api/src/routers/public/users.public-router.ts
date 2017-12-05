import { Router, Request, Response } from 'express';
import { TokensMethods } from '../../methods/tokens.methods';
import { errors } from '../../errors';

export class UsersPublicRouter {
  router = Router();

  constructor(private tokensMethods: TokensMethods) {
    this.router.post('/login', async (request: Request, response: Response) => {
      const email = request.body.email;
      const password = request.body.password;
      if (!password || !email) return response.status(401).send(errors[1]);
      const userIp = String(request.headers['x-real-ip']);
      const token = tokensMethods.issueToken(2, 'Maciej Tokarz', userIp);
      response.end(token);
    });
  }
}
