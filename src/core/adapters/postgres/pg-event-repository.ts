import { EntityManager } from '@mikro-orm/postgresql';
import { IEventRepository } from 'src/core/ports/event-repository.interface';
import { PgEvent, PgEventSchema } from './entities/event.pg-entity';
import { Event } from 'src/core/domain/entities/event.entity';

export class PgEventRepository implements IEventRepository {
  constructor(private readonly em: EntityManager) {}

  async create(event: Event) {
    const pgEvent = this.toPersistence(event);
    this.em.create(PgEventSchema, pgEvent);
    await this.em.flush();
  }

  async findUnprocessedBatch(limit: number): Promise<Event[]> {
    const sql = `
      with candidates as (
        select id from "event"
        where processed_at is null and claimed_at is null
        order by occurred_at asc, id asc
        limit ?
        for update skip locked
      ),
      claimed as (
        update "event" e
        set claimed_at = now()
        from candidates c
        where e.id = c.id
        returning e.*
      )
      select * from claimed;
    `;
    const conn = this.em.getConnection();
    const rows = await conn.execute<PgEvent[]>(sql, [limit], 'all');
    return rows.map((r: PgEvent) => this.toDomain(r)) ?? [];
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.em
      .getConnection()
      .execute(`update "event" set processed_at = now() where id = ?`, [
        eventId,
      ]);
  }

  async markUnclaimed(eventId: string): Promise<void> {
    await this.em
      .getConnection()
      .execute(
        `update "event" set claimed_at = null where id = ? and processed_at is null`,
        [eventId],
      );
  }

  protected toPersistence(event: Event): PgEvent {
    return {
      id: event.props.id,
      type: event.props.type,
      occurredAt: event.props.occurredAt,
      claimedAt: event.props.claimedAt,
      processedAt: event.props.processedAt,
      payload: event.props.payload,
    };
  }

  protected toDomain(event: PgEvent): Event {
    return new Event({
      id: event.id,
      type: event.type,
      occurredAt: event.occurredAt,
      claimedAt: event.claimedAt ?? null,
      processedAt: event.processedAt ?? null,
      payload: event.payload,
    });
  }
}
