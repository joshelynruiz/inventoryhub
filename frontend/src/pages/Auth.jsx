import { useState } from 'react'
import { useAuth } from '../AuthContext'
import api from '../api'

export default function Auth() {
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await api.post('/auth/register', { email, password })
        await login(email, password)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <div className="toggle-link">
          {isLogin ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
          <span onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </span>
        </div>
      </div>
    </div>
  )
}
