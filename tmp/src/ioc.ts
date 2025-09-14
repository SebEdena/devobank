import { Container } from "inversify";
import { BcryptPasswordHandler } from "./adapters/password/bcrypt-password-handler.js";
import { config } from "./config.js";
import type { PasswordHandler } from "./ports/password-handler.interface.js";

const TYPES = {
  mainDb: Symbol.for("mainDb"),
  readDb: Symbol.for("readDb"),
};

const container = new Container();
container.bind<string>(TYPES.mainDb).toConstantValue(config.MAIN_DB_CONNECTION);
container.bind<string>(TYPES.readDb).toConstantValue(config.READ_DB_CONNECTION);
container.bind<PasswordHandler>("PasswordHandler").to(BcryptPasswordHandler).inSingletonScope();

export { container, TYPES };
