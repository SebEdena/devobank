import type { JwtPayload } from "@domain/ports/jwt.interface";
import jsonwebtoken, { sign, verify } from "jsonwebtoken";
import { describe, expect, test, vi } from "vitest";
import { JsonWebTokenJwtHandler } from "./jsonwebtoken-jwt-handler";

describe("JsonWebTokenJwtHandler", () => {
  function makeClass(secret = "test-secret"): JsonWebTokenJwtHandler {
    return new JsonWebTokenJwtHandler(secret);
  }

  describe("sign", () => {
    test("sign JWT", async () => {
      const secret = "test-secret";
      const jwtHandler = makeClass(secret);
      const token = await jwtHandler.sign({ userId: "123" });
      const payload = verify(token, secret) as JwtPayload;
      expect(payload.userId).toEqual("123");
      expect(payload.sub).toEqual("123");
      expect(payload.exp).toBeLessThanOrEqual(Date.now() + 3600 * 1000);
    });

    test("should fail to reject with invalid secret", async () => {
      using _signSpy = vi.spyOn(jsonwebtoken, "sign").mockImplementation((_data, _secret, _config, cb) => {
        cb(new Error("Invalid secret"), undefined);
      });
      const jwtHandler = makeClass();
      await expect(jwtHandler.sign({ userId: "123" })).rejects.toThrowError();
    });
  });

  describe("verify", () => {
    test("verify JWT", async () => {
      const secret = "test-secret";
      const jwtHandler = makeClass(secret);
      const token = sign({ userId: "123" }, secret, { expiresIn: "1h", subject: "123" });
      const payload = await jwtHandler.verify(token);
      expect(payload.userId).toEqual("123");
      expect(payload.sub).toEqual("123");
      expect(payload.exp).toBeLessThanOrEqual(Date.now() + 3600 * 1000);
    });

    test("should fail to reject with invalid token", async () => {
      const jwtHandler = makeClass();
      await expect(jwtHandler.verify("invalid-token")).rejects.toThrowError();
    });
  });
});
