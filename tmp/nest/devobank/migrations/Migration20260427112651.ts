import { Migration } from '@mikro-orm/migrations';

export class Migration20260427112651 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "event" ("id" varchar(255) not null, "type" varchar(128) not null, "occurred_at" timestamptz not null, "status" text not null, "payload" jsonb not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "event" add constraint "event_status_check" check ("status" in ('pending', 'processed', 'failed'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "event" cascade;`);
  }
}
