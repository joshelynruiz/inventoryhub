import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const navigate = useNavigate()

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.access_token)
    setToken(data.access_token)
    navigate('/dashboard')
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
