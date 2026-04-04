import { Entity } from './entity';

type TestEntityProps = {
  id: string;
  name: string;
};

class TestEntity extends Entity<TestEntityProps> {
  protected cloneWith(props: Partial<TestEntityProps>): this {
    return new TestEntity({
      ...this.props,
      ...props,
    }) as this;
  }
}

describe('Entity', () => {
  let entity: TestEntity;

  beforeEach(() => {
    entity = new TestEntity({
      id: 'entity-1',
      name: 'John Doe',
    });
  });

  it('should expose readonly props', () => {
    expect(entity.props).toEqual({
      id: 'entity-1',
      name: 'John Doe',
    });
    expect(Object.isFrozen(entity.props)).toBe(true);
  });

  it('should clone without changing props', () => {
    const cloned = entity.clone();

    expect(cloned).not.toBe(entity);
    expect(cloned.props).toEqual(entity.props);
  });

  it('should create a new instance with merged props', () => {
    const updated = entity.with({ name: 'Jane Doe' });

    expect(updated).not.toBe(entity);
    expect(updated.props).toEqual({
      id: 'entity-1',
      name: 'Jane Doe',
    });
    expect(entity.props).toEqual({
      id: 'entity-1',
      name: 'John Doe',
    });
  });
});
