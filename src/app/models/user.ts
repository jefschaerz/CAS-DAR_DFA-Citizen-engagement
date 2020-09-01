// Create model class for user
export type Role = "citizen" | "staff";

export class User {
  id: string;
  href: string;
  name: string;
  firstname: string;
  lastname: string;
  password: string;
  phone?: string;
  roles: Role[];
}