import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '../context/AuthContext.tsx'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FormField } from '../components/FormField'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/bikes')
    } catch (err) {
      const message =
        err instanceof AxiosError && err.response?.data
          ? typeof err.response.data === 'string'
            ? err.response.data
            : (err.response.data as { message?: string }).message ?? 'Не вдалося увійти'
          : 'Не вдалося увійти'
      setError(message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page form-page">
      <Card title="Вхід">
        <form className="form" onSubmit={handleSubmit}>
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="alert alert-danger">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Входимо...' : 'Увійти'}
          </Button>
          <NavLink to="/register" className="link">
            Немає акаунта? Зареєструйтеся
          </NavLink>
        </form>
      </Card>
    </div>
  )
}

export default Login
