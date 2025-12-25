import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import { Button } from './Button'
import '../App.css'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        BikeRent
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/bikes">Велосипеди</NavLink>
        <NavLink to="/stations">Станції</NavLink>
        <NavLink to="/rentals/active">Активна оренда</NavLink>
        <NavLink to="/rentals/history">Історія</NavLink>
        {user?.role === 'Admin' && (
          <>
            <NavLink to="/admin/bikes">Адмін велосипеди</NavLink>
            <NavLink to="/admin/stations">Адмін станції</NavLink>
          </>
        )}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <NavLink to="/profile" className="user-chip">
              {user.email} ({user.role})
            </NavLink>
            <Button variant="ghost" onClick={handleLogout}>
              Вийти
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Увійти
            </Button>
            <Button onClick={() => navigate('/register')}>
              Зареєструватися
            </Button>
          </>
        )}
      </div>
    </header>
  )}
