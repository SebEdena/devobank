import { Container } from "inversify";
import { config } from "./config";

const TYPES = {
  mainDb: Symbol.for("mainDb"),
  readDb: Symbol.for("readDb"),
};

const container = new Container();
container.bind<string>(TYPES.mainDb).toConstantValue(config.MAIN_DB_CONNECTION);
container.bind<string>(TYPES.readDb).toConstantValue(config.READ_DB_CONNECTION);

export { container, TYPES };
