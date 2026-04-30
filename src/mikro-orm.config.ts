import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { Config } from './config';

import 'dotenv/config';

const config = Config.parse(process.env);

export default defineConfig({
  entities: ['dist/**/*.pg-entity.js'],
  entitiesTs: ['src/**/*.pg-entity.ts'],
  driver: PostgreSqlDriver,
  clientUrl: config.mainDatabaseUrl,
  extensions: [Migrator],
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
});
