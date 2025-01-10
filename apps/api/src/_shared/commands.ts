export abstract class ICommand<Payload, ReturnType> {
  constructor(protected payload: Payload) {}

  abstract execute(): Promise<ReturnType>;
}
