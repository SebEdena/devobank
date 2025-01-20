import amqp from "amqplib";

export abstract class MQClient {
  protected _connection?: amqp.Connection;
  protected _channel?: amqp.Channel;

  constructor(
    protected _options: Partial<{ host: string; user: string; password: string }>,
    protected _exchange: string,
    protected _queue: string,
  ) {}

  async connect() {
    try {
      process.on("SIGTERM", async () => await this.disconnect());

      const connection = await amqp.connect({
        hostname: this._options.host,
        username: this._options.user,
        password: this._options.password,
      });
      this._connection = connection;

      const channel = await connection.createChannel();
      await channel.assertExchange(this._exchange, "fanout", { durable: true });
      await channel.prefetch(1);
      const { queue } = await channel.assertQueue(this._queue, { durable: true });
      await channel.bindQueue(queue, this._exchange, "");
      this._channel = channel;
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this._channel) {
        await this._channel.close();
        this._channel = undefined;
      }
      if (this._connection) {
        await this._connection.close();
        this._connection = undefined;
      }
    } catch (ignored) {}
  }
}
