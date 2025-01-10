export abstract class IQuery<Payload, ReturnType> {
  constructor(protected payload: Payload) {}

  abstract execute(): Promise<ReturnType>;
}
