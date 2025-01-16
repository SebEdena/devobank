import { makeProducer } from "..";
import { UserCreated } from "../src/events/user-created.event";

const producer = await makeProducer();

await producer.connect();

await producer.send(new UserCreated({ userId: "123", email: "aa" }));

producer.disconnect();
