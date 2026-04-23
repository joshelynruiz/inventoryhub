import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Movements from './pages/Movements'
import Alerts from './pages/Alerts'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function Navbar() {
  const { logout } = useAuth()
  return (
    <nav>
      <NavLink to="/dashboard" className="brand">InventoryHub</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/products">Productos</NavLink>
      <NavLink to="/movements">Movimientos</NavLink>
      <NavLink to="/alerts">Alertas</NavLink>
      <button className="logout" onClick={logout}>Salir</button>
    </nav>
  )
}

function AppRoutes() {
  const { token } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute><div className="layout"><Navbar /><Dashboard /></div></PrivateRoute>}
      />
      <Route
        path="/products"
        element={<PrivateRoute><div className="layout"><Navbar /><Products /></div></PrivateRoute>}
      />
      <Route
        path="/movements"
        element={<PrivateRoute><div className="layout"><Navbar /><Movements /></div></PrivateRoute>}
      />
      <Route
        path="/alerts"
        element={<PrivateRoute><div className="layout"><Navbar /><Alerts /></div></PrivateRoute>}
      />
      <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
