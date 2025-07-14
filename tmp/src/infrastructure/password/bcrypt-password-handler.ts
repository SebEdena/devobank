import bcrypt from "bcrypt";
import { injectable } from "inversify";
import type { PasswordHandler } from "@domain/adapters/password-handler.interface";

@injectable()
export class BcryptPasswordHandler implements PasswordHandler {
    async hash(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

