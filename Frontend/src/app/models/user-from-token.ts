import { Role } from './role';

export class UserFromToken {

  id: number;
  name: string;
  email: string;
  role: Role;
  organizationId: number;

  constructor(id, name, email, role, organizationId) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.organizationId = organizationId;
  }
}
