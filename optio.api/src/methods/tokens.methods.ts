import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Config } from '../config';
import { VerifyCallback } from 'jsonwebtoken';

export class TokensMethods {
  config = new Config();

  issueToken(userId: number, userName: string, userIp: string): string {
    const payload = {
      // tokenId: result.insertId,
      userId: userId,
      userName: userName,
      userIp: userIp
    };

    const token = jwt.sign(payload, this.config.secretKey, {
      expiresIn: '60 days' // Eg: 60, "2 days", "10h", "7d"
    });

    return token;

    // jwt.verify(token, this.config.secretKey, (error, decoded: any) => {
    //   if (error) return response.status(500).send(error.message);
    //   const values = [
    //     decoded.userId,
    //     decoded.userIp,
    //     new Date(decoded.iat * 1000),
    //     new Date(decoded.exp * 1000)
    //     // result.insertId
    //   ];

    //   // usersMethods.setUserActivity(values[2], decoded.userId, decoded.userName, decoded.userIp, token, res)
    // });
  }
}
