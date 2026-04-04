type DomainExceptionPayload = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
};

export abstract class DomainException extends Error {
  readonly code: string;
  readonly status: number;

  constructor(payload: Partial<DomainExceptionPayload> = {}) {
    const ctor = new.target ?? DomainException;
    const resolvedPayload = {
      ...ctor.defaultPayload(),
      ...payload,
    };

    super(resolvedPayload.message);
    this.name = ctor.name;
    this.code = resolvedPayload.code;
    this.status = resolvedPayload.status;
  }

  protected static defaultPayload(): DomainExceptionPayload {
    return {
      code: 'domain-exception',
      message: 'A domain exception occurred.',
      status: 500,
    };
  }
}
