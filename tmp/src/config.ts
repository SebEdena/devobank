export const config = {
  MAIN_DB_CONNECTION: process.env.MAIN_DB_CONNECTION ?? "",
  READ_DB_CONNECTION: process.env.READ_DB_CONNECTION ?? "",
  MQ_URL: process.env.MQ_URL ?? "",
  MQ_QUEUE: process.env.MQ_QUEUE ?? "",
  MQ_EXCHANGE: process.env.MQ_EXCHANGE ?? "",
} as const;
