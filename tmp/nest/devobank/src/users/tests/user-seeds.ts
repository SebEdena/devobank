import { User } from 'src/users/entities/user.entity';

export const userSeeds: Record<string, User> = {
  john: new User({
    id: 'user-1',
    email: 'john.doe@example.com',
    password: 'password123',
    name: 'John Doe',
  }),
};
