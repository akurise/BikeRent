import axios from 'axios'

// Default to HTTPS dev port used by ASP.NET templates; override via VITE_API_URL when needed.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://localhost:7018'
const TOKEN_KEY = 'bike_rent_token'

let authToken: string | null = null

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
})

export function loadStoredToken() {
  const stored = localStorage.getItem(TOKEN_KEY)
  if (stored) {
    authToken = stored
  }
  return authToken
}

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

export function getToken() {
  return authToken
}

export { TOKEN_KEY }
