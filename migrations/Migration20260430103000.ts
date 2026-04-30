import { Migration } from '@mikro-orm/migrations';

export class Migration20260430103000 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `alter table "event" add column "processed_at" timestamptz null;`,
    );
    this.addSql(
      `alter table "event" add column "claimed_at" timestamptz null;`,
    );

    this.addSql(
      `alter table "event" drop constraint if exists "event_status_check";`,
    );
    this.addSql(`alter table "event" drop column "status";`);
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "event" add column "status" text not null default 'pending';`,
    );
    this.addSql(
      `update "event" set "status" = case when processed_at is null then 'pending' else 'processed' end;`,
    );
    this.addSql(
      `alter table "event" add constraint "event_status_check" check ("status" in ('pending', 'processed', 'failed'));`,
    );

    this.addSql(`alter table "event" drop column "claimed_at";`);
    this.addSql(`alter table "event" drop column "processed_at";`);
  }
}
