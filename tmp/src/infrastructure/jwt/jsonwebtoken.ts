import type { JwtHandler, JwtPayload } from "@domain/adapters/jwt.interface";
import { sign, verify } from "jsonwebtoken";

export class JsonWebToken implements JwtHandler {
  private secret = "blablabla"; // This should be securely managed, e.g., using environment variables

  sign(data: { userId: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(data, this.secret, { expiresIn: "1h" }, (err, token) => {
        if (err || !token) {
          reject(`Error signing JWT: ${err?.message ?? "Unknown error"}`);
        } else {
          resolve(token);
        }
      });
    });
  }

  verify(token: string): Promise<JwtPayload> {
    // Implementation for verifying a JWT
    return new Promise((resolve, reject) => {
      verify(token, this.secret, {}, (err, decoded) => {
        if (err || !decoded) {
          reject(`Error verifying JWT: ${err?.message ?? "Unknown error"}`);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }
}
