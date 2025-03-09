import { exec } from "node:child_process";
import { config } from "../src/config";

const url = [
  "postgres://",
  config.PG_USER_MAIN,
  ":",
  config.PG_PASSWORD_MAIN,
  "@",
  config.PG_HOST_MAIN,
  ":",
  config.PG_PORT_MAIN,
  "/",
  config.PG_DATABASE_MAIN,
].join("");

const file = "src/models.ts";

const script = exec(`kysely-codegen --dialect postgres --singular --url ${url} --out-file ${file}`);

script.stdout?.on("data", (data) => {
  console.log(data);
});

script.stderr?.on("data", (data) => {
  console.error(data);
});
