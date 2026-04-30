import { Test } from '@nestjs/testing';
import { AppModule } from 'src/core/app.module';
import { IFixture } from './fixture';
import { ConfigModule } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import mikroOrmConfig from 'src/mikro-orm.config';
import { GlobalExceptionFilter } from 'src/shared/global-exception.filter';
import { MikroORM } from '@mikro-orm/postgresql';
import { Server } from 'node:net';
import config from 'src/config';

export class TestApp {
  private app!: NestFastifyApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          isGlobal: true,
          load: [
            () =>
              config({
                MAIN_DATABASE_URL:
                  'postgresql://devobank:devobank@localhost:5442/devobank-main',
                QUEUE_URL: 'redis://devobank:devobank@localhost:6380',
              }),
          ],
        }),
      ],
    }).compile();

    this.app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    this.app.useGlobalFilters(new GlobalExceptionFilter());
    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();
  }

  async cleanup() {
    await this.clearDatabase();
    await this.app.close();
  }

  async loadFixtures(fixtures: Array<IFixture>) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }

  get<T>(name: Parameters<NestApplication['get']>[0]): T {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer() as Server;
  }

  private async clearDatabase() {
    const instance = await MikroORM.init(mikroOrmConfig);
    try {
      const rowsUnknown: unknown = await instance.em.getConnection().execute(`
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_type = 'BASE TABLE'
          and table_name not in ('mikro_orm_migrations', '_mikro_orm_migrations')
      `);

      if (!Array.isArray(rowsUnknown)) return;

      const rows = rowsUnknown
        .filter(
          (row): row is { table_name: string } =>
            typeof row === 'object' &&
            row !== null &&
            typeof (row as Record<string, unknown>).table_name === 'string',
        )
        .map((row) => row.table_name);

      if (rows.length === 0) return;

      const tableList = rows.map((tableName) => `"${tableName}"`).join(', ');

      await instance.em
        .getConnection()
        .execute(`truncate table ${tableList} restart identity cascade`);
    } finally {
      await instance.close(true);
    }
  }
}
