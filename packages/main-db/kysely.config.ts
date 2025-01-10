import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { dialect } from "./src/database";

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "migrations",
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  seeds: {
    getSeedPrefix: () => "",
    seedFolder: "seeds",
  },
});
