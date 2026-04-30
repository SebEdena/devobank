import { Migration } from '@mikro-orm/migrations';

export class Migration20260429120834 extends Migration {
  override up(): void | Promise<void> {
    // NOTIFY trigger function
    this.addSql(`
      create or replace function notify_outbox_new_event()
      returns trigger language plpgsql as $$
      begin
        perform pg_notify(
          'outbox_new_event',
          json_build_object('id', new.id, 'type', new.type)::text
        );
        return new;
      end;
      $$;
    `);

    this.addSql(`drop trigger if exists trg_outbox_notify on "event";`);
    this.addSql(`
      create trigger trg_outbox_notify
      after insert on "event"
      for each row execute function notify_outbox_new_event();
    `);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop trigger if exists trg_outbox_notify on "event";`);
    this.addSql(`drop function if exists notify_outbox_new_event();`);
  }
}
