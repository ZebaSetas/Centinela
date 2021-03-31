import { Role } from './role';

export class User {

  id: number;
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  role: Role;
  organizationName: string;

  constructor(email, password, name) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
