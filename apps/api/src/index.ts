import { app } from "./app";

const { server } = app.listen(3000);

console.log(`🦊 Elysia is running at ${server?.hostname}:${server?.port}`);
