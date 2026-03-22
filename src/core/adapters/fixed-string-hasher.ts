import { IStringHasher } from '../ports/string-hasher.interface';

export class BcryptStringHasher implements IStringHasher {
  hash(value: string): Promise<string> {
    return Promise.resolve('hashed:' + value);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    const hashedTestValue = await this.hash(value);
    return hashedTestValue === hashed;
  }
}
