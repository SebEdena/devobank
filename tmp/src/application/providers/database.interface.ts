export interface Database<T> {
  get instance(): T;
}
