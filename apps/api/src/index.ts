import { app } from "./app";

app.listen(8080, ({ url }) => {
  console.log(`🦊 Elysia is running at ${url}`);
});
