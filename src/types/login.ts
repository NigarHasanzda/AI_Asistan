// src/types/login.ts
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string; // və ya serverdən gələn digər məlumatlar
  userId?: string;
  username?: string;
  email?: string;
}