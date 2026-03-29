import type { IStringHasher } from '../ports/string-hasher.interface';

export class NoOpStringHasher implements IStringHasher {
  hash(value: string): Promise<string> {
    return Promise.resolve(value);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    const hashedTestValue = await this.hash(value);
    return hashedTestValue === hashed;
  }
}
