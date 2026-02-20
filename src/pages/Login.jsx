import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Inicia sesión</h1>
          <p className="login-subtitle">Accede a tu cuenta para comprar y gestionar tus libros</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="login-error">{error}</p>}

          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <div className="forgot-password-wrapper">
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <p className="login-register">
          ¿No tienes cuenta? <a href="#" className="register-link">REGISTRATE</a>
        </p>
      </div>
    </div>
  )
}

export default Login

