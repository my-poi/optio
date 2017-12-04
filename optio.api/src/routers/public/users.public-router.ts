import { Router, Request, Response } from 'express';
import { TokensMethods } from '../../methods/tokens.methods';

export class UsersPublicRouter {
  router = Router();

  constructor(private tokensMethods: TokensMethods) {
    this.router.post('/login', async (request: Request, response: Response) => {
      const email = request.body.email;
      const password = request.body.password;
      if (!password || !email) return response.status(401).send({success: false, message: 'No credentials provided.', errorCode: '0004'});
      const userIp = request.headers.host !== 'localhost:8000' ? request.headers['x-real-ip'] : 'localhost';
      const token = tokensMethods.issueToken(2, 'Maciej Tokarz', String(userIp));
      response.end(token);
    });
  }
}
