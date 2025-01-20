import { makeProducer } from "..";
import { config } from "../src/config";
import { UserCreated } from "../src/events/user-created.event";

const producer = await makeProducer(config.MQ_EVENT_QUEUE);

await producer.connect();

await producer.send(new UserCreated({ userId: "123", email: "aa" }));

producer.disconnect();
