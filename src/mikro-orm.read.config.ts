import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import loadConfig from './config';

import 'dotenv/config';

const config = loadConfig(process.env);

export default defineConfig({
  entities: ['dist/**/*.pg-read-entity.js'],
  entitiesTs: ['src/**/*.pg-read-entity.ts'],
  driver: PostgreSqlDriver,
  clientUrl: config.readDatabaseUrl,
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations_read',
    path: './migrations/read',
    pathTs: './migrations/read',
  },
});
