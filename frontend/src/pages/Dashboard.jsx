import { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [p, a, m] = await Promise.all([
          api.get('/products/'),
          api.get('/alerts/'),
          api.get('/movements/'),
        ])
        setProducts(p.data)
        setAlerts(a.data)
        setMovements(m.data.slice(0, 5))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="loading">Cargando dashboard...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Productos activos</h3>
          <div className="value">{products.length}</div>
        </div>
        <div className="card alert-card">
          <h3>Alertas de stock</h3>
          <div className="value">{alerts.length}</div>
        </div>
        <div className="card">
          <h3>Movimientos totales</h3>
          <div className="value">{movements.length > 0 ? '5 recientes' : '0'}</div>
        </div>
      </div>

      <p className="section-title">Últimos 5 movimientos</p>
      {movements.length === 0 ? (
        <div className="empty">Sin movimientos registrados aún.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Producto ID</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Motivo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>{m.product_id}</td>
                  <td>{m.tipo}</td>
                  <td>{m.cantidad}</td>
                  <td>{m.motivo || '—'}</td>
                  <td>{new Date(m.timestamp).toLocaleString('es-PE', { timeZone: 'America/Lima' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
