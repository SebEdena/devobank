import { Migration } from '@mikro-orm/migrations';

export class Migration20260406123744 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "user" ("id" varchar(255) not null, "email" varchar(128) not null, "password" varchar(128) not null, "name" varchar(256) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
