export abstract class Entity<T> {
  private _props: T;

  constructor(data: T) {
    this._props = { ...data };
  }

  get props(): T {
    return this._props;
  }

  update(data: Partial<T>): void {
    this._props = { ...this._props, ...data } as T;
  }
}
