export const I_STRING_HASHER = 'IStringHasher';

export interface IStringHasher {
  hash(value: string): Promise<string>;
  compare(value: string, hashed: string): Promise<boolean>;
}
