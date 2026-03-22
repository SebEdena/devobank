import { compare, hash } from 'bcrypt';
import { IStringHasher } from '../ports/string-hasher.interface';

export class BcryptStringHasher implements IStringHasher {
  hash(value: string): Promise<string> {
    return hash(value, 10);
  }
  compare(value: string, hashed: string): Promise<boolean> {
    return compare(value, hashed);
  }
}
