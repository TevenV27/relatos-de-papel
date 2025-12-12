// src/pages/Landing.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Landing.css'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      // redirige explícitamente a /home (NO a /login)
      navigate('/home', { replace: true })
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">Relatos de Papel</h1>
        <p className="landing-subtitle">La magia de los libros te espera...</p>
        <p className="landing-timer">Serás redirigido a la página principal en 5 segundos...</p>
        <div style={{ marginTop: 16 }}>
          <button className="landing-button" onClick={() => navigate('/home')}>Ir ahora al catálogo</button>
        </div>
      </div>
    </div>
  )
}

export default Landing
