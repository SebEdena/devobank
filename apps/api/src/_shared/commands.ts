export abstract class ICommand<T> {
  abstract execute(): T;
}
