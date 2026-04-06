import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import 'dotenv/config';
import { userEntities } from 'src/users/users-persistence.module';

const clientUrl =
  process.env.MAIN_DATABASE_URL ||
  'postgresql://devobank:devobank@localhost:5432/devobank-main';

export default defineConfig({
  entities: [...userEntities],
  driver: PostgreSqlDriver,
  clientUrl,
  extensions: [Migrator],
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
});
