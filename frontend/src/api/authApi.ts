import axios from 'axios';

const TOKEN_KEY = 'jwt_token';

export interface LoginResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>('http://localhost:8080/api/auth/login', {
    email,
    password,
  });
  return res.data;
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
