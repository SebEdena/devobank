import { $ } from "bun";
import { config } from "../src/config";

const url = [
  "postgres://",
  config.PG_USER,
  ":",
  config.PG_PASSWORD,
  "@",
  config.PG_HOST,
  ":",
  config.PG_PORT,
  "/",
  config.PG_DATABASE,
].join("");

const file = "src/models.ts";

await $`bun run kysely-codegen --dialect postgres --singular --url ${url} --out-file ${file}`;
