import type { JwtHandler, JwtPayload } from "@ports/jwt.interface";
import { sign, verify } from "jsonwebtoken";

export class JsonWebTokenJwtHandler implements JwtHandler {
  constructor(private readonly secret: string) {}

  sign(data: { userId: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(data, this.secret, { expiresIn: "1h", subject: data.userId }, (err, token) => {
        if (err || !token) {
          reject(`Error signing JWT: ${err?.message}`);
        } else {
          resolve(token);
        }
      });
    });
  }

  verify(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      verify(token, this.secret, {}, (err, decoded) => {
        if (err || !decoded) {
          reject(`Error verifying JWT: ${err?.message}`);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }
}
