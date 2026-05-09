import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import loadConfig from './config';

import 'dotenv/config';

const config = loadConfig(process.env);

export default defineConfig({
  entities: ['dist/**/*.pg-entity.js'],
  entitiesTs: ['src/**/*.pg-entity.ts'],
  driver: PostgreSqlDriver,
  clientUrl: config.mainDatabaseUrl,
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations_write',
    path: './migrations/write',
    pathTs: './migrations/write',
  },
});
