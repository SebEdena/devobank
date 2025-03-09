import { config } from "../src/config";
import { exec } from "node:child_process";

const url = [
  "postgres://",
  config.PG_USER_READ,
  ":",
  config.PG_PASSWORD_READ,
  "@",
  config.PG_HOST_READ,
  ":",
  config.PG_PORT_READ,
  "/",
  config.PG_DATABASE_READ,
].join("");

const file = "src/models.ts";

const script = exec(`kysely-codegen --dialect postgres --singular --url ${url} --out-file ${file}`);

script.stdout?.on("data", (data) => {
  console.log(data);
});

script.stderr?.on("data", (data) => {
  console.error(data);
});
