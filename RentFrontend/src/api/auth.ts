import { api } from './axios'

export type Role = 'User' | 'Admin'

export interface AuthUser {
  id: number
  email: string
  role: Role
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto extends LoginDto {}

export async function login(data: LoginDto) {
  const res = await api.post<AuthResponse>('/auth/login', data)
  return res.data
}

export async function register(data: RegisterDto) {
  const res = await api.post<AuthResponse>('/auth/register', data)
  return res.data
}

export async function getMe() {
  const res = await api.get<AuthUser>('/auth/me')
  return res.data
}
