import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { createMainDbConnection } from "../../../tmp/infrastructure/database/main-db";
import { PgUserRepository } from "../../../tmp/infrastructure/repositories/pg-user-repository";
import { CreateUserUseCase } from "../../../tmp/src/application/use-cases/user/create-user.use-case";
import { RabbitMQEventEmitter } from "../../../tmp/infrastructure/messaging/rabbitmq-event-emitter";
import { createUserController } from "../../../tmp/src/application/controllers/user-controller";

// Configuration
const config = {
  db: {
    host: process.env.PG_HOST_MAIN || "localhost",
    port: 5432,
    database: "devobank-main",
    user: "devobank",
    password: "devobank",
  },
  eventQueue: "events",
};

// Setup dependencies
const mainDb = createMainDbConnection(config.db);
const userRepository = new PgUserRepository(mainDb);
const eventEmitter = new RabbitMQEventEmitter(config.eventQueue);
const createUserUseCase = new CreateUserUseCase(userRepository, eventEmitter);

// Setup controllers
const userController = createUserController(createUserUseCase);

// Setup API
const app = new Elysia().use(bearer()).use(userController).listen(8080);

console.log(`API is running at ${app.server?.hostname}:${app.server?.port}`);
