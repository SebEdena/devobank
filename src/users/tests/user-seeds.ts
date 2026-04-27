import { User } from 'src/users/domain/entities/user.entity';

class UserSeeds {
  private readonly seeds = {
    john: new User({
      id: 'user-1',
      email: 'john.doe@example.com',
      password: 'password123',
      name: 'John Doe',
    }),
  } as const;

  get(name: keyof UserSeeds['seeds']): User {
    return this.seeds[name].clone();
  }
}

export const userSeeds = new UserSeeds();
