export class User {
  id: string;
  email: string;
  password: string;

  constructor(data: {
    id: string;
    email: string;
    password: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
  }
}
