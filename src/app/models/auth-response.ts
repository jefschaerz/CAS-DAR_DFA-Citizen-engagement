// Create model for authentification response
import { User } from "./user";

export class AuthResponse {
  token: string;
  user: User;
}