export const config = {
  MAIN_DB_CONNECTION: process.env.MAIN_DB_CONNECTION ?? "",
  READ_DB_CONNECTION: process.env.READ_DB_CONNECTION ?? "",
} as const;
