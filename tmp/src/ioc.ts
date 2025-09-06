import { BcryptPasswordHandler } from "@shared/adapters/password/bcrypt-password-handler";
import { config } from "@shared/config";
import type { PasswordHandler } from "@shared/ports/password-handler.interface";
import { Container } from "inversify";

const TYPES = {
  mainDb: Symbol.for("mainDb"),
  readDb: Symbol.for("readDb"),
};

const container = new Container();
container.bind<string>(TYPES.mainDb).toConstantValue(config.MAIN_DB_CONNECTION);
container.bind<string>(TYPES.readDb).toConstantValue(config.READ_DB_CONNECTION);
container.bind<PasswordHandler>("PasswordHandler").to(BcryptPasswordHandler).inSingletonScope();

export { container, TYPES };
