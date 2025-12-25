import { useAuth } from '../context/AuthContext.tsx'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import '../App.css'

function Profile() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="page">
      <Card title="Профіль" subtitle="Дані облікового запису">
        <div className="info-list">
          <div>
            <span className="label">Email</span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="label">Роль</span>
            <span>{user.role}</span>
          </div>
          <div>
            <span className="label">Створено</span>
            <span>{new Date(user.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <Button variant="secondary" onClick={logout}>
          Вийти
        </Button>
      </Card>
    </div>
  )
}

export default Profile
