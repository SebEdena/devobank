import bcrypt from "bcrypt";
import { describe, expect, test, vi } from "vitest";
import { BcryptPasswordHandler } from "./bcrypt-password-handler";

describe("BcryptPasswordHandler", () => {
  function makeClass(): BcryptPasswordHandler {
    return new BcryptPasswordHandler();
  }

  test("hash", async () => {
    const password = "testPassword";
    const handler = makeClass();
    const mockSalt = bcrypt.genSaltSync(10);
    const expectedHashedPassword = bcrypt.hashSync(password, mockSalt);

    using hashSpy = vi.spyOn(bcrypt, "hash");
    using _genSaltSpy = vi.spyOn(bcrypt, "genSalt").mockImplementation(() => mockSalt);
    const hashedPassword = await handler.hash(password);

    expect(hashedPassword).toEqual(expectedHashedPassword);
    expect(hashSpy).toHaveBeenCalled();
  });

  test("compare", async () => {
    const password = "testPassword";
    const handler = makeClass();
    const hashedPassword = bcrypt.hashSync(password, 10);
    using compareSpy = vi.spyOn(bcrypt, "compare");

    const result = await handler.compare(password, hashedPassword);
    expect(result).toBe(true);
    expect(compareSpy).toHaveBeenCalled();
  });
});
