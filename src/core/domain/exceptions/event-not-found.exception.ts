import { DomainException } from 'src/shared/exception';

export class EventNotFoundException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'event-not-found',
      message: 'The requested event was not found.',
      status: 404,
    };
  }
}
