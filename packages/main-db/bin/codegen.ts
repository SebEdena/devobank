import { config } from "@devobank/config";
import { $ } from "bun";

const url = [
  "postgres://",
  config.pg.user,
  ":",
  config.pg.password,
  "@",
  config.pg.host,
  ":",
  config.pg.port,
  "/",
  config.pg.database,
].join("");

const file = "src/models.ts";

await $`bun run kysely-codegen --dialect postgres --singular --url ${url} --out-file ${file}`;
