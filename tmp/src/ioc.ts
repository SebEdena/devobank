import { Container } from "inversify";
import type { PasswordHandler } from "./application/providers/password-handler.interface";
import { config } from "./config";
import { BcryptPasswordHandler } from "./infrastructure/password/bcrypt-password-handler";

const TYPES = {
  mainDb: Symbol.for("mainDb"),
  readDb: Symbol.for("readDb"),
};

const container = new Container();
container.bind<string>(TYPES.mainDb).toConstantValue(config.MAIN_DB_CONNECTION);
container.bind<string>(TYPES.readDb).toConstantValue(config.READ_DB_CONNECTION);
container.bind<PasswordHandler>("PasswordHandler").to(BcryptPasswordHandler).inSingletonScope();

export { container, TYPES };
