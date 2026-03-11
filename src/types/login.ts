// src/types/login.ts
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;         // Serverdən gələn token
  role: number;          // 0 = admin, 1 = student, 2 = employer
  userId?: string;
  username?: string;
  email?: string;
}