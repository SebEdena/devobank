import type { IIdGenerator } from 'src/core/ports/id-generator.interface';
import { v7 } from 'uuid';

export class RandomIdGenerator implements IIdGenerator {
  generate(): string {
    return String(v7());
  }
}
