import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { getMe, login as apiLogin, register as apiRegister } from '../api/auth'
import type { AuthUser, LoginDto, RegisterDto } from '../api/auth'
import { loadStoredToken, setAuthToken } from '../api/axios'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (payload: LoginDto) => Promise<void>
  register: (payload: RegisterDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existing = loadStoredToken()
    if (!existing) {
      setLoading(false)
      return
    }

    setAuthToken(existing)
    setToken(existing)

    getMe()
      .then((me) => setUser(me))
      .catch(() => {
        setAuthToken(null)
        setUser(null)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (payload: LoginDto) => {
    const res = await apiLogin(payload)
    setAuthToken(res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (payload: RegisterDto) => {
    const res = await apiRegister(payload)
    setAuthToken(res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
