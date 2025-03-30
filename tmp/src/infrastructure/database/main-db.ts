import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "../../src/application/database/main-db.types";

export function createMainDbConnection(config: {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}): Kysely<Database> {
  const dialect = new PostgresDialect({
    pool: new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: 10,
    }),
  });

  return new Kysely<Database>({
    dialect,
  });
}
