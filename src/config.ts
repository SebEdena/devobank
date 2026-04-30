import z from 'zod';

export const Config = z.object({
  mainDatabaseUrl: z
    .string()
    .default('postgresql://devobank:devobank@localhost:5432/devobank-main'),
  queueUrl: z.string().default('redis://devobank:devobank@localhost:6379'),
});

export type Config = z.infer<typeof Config>;

export default (
  env: Record<string, string | undefined> = process.env,
): Config => {
  return Config.parse({
    mainDatabaseUrl: env.MAIN_DATABASE_URL,
    queueUrl: env.QUEUE_URL,
  });
};
