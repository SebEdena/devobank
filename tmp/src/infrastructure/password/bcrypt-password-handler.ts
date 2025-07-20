import type { PasswordHandler } from "@domain/ports/password-handler.interface";
import bcrypt from "bcrypt";
import { injectable } from "inversify";

@injectable()
export class BcryptPasswordHandler implements PasswordHandler {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
