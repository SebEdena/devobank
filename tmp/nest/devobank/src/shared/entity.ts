export abstract class Entity<T> {
  private readonly _props: T;

  constructor(data: T) {
    this._props = Object.freeze(data) as T;
  }

  get props(): Readonly<T> {
    return this._props;
  }

  clone(): this {
    return this.cloneWith({});
  }

  with(props: Partial<T>): this {
    return this.cloneWith(props);
  }

  protected abstract cloneWith(props: Partial<T>): this;
}
