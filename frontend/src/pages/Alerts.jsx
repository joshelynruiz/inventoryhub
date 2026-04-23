import { useEffect, useState } from 'react'
import api from '../api'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/alerts/').then(({ data }) => {
      setAlerts(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading">Cargando alertas...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Alertas de stock</h1>
      </div>

      {alerts.length === 0 ? (
        <div className="card">
          <div className="empty">No hay alertas. Todos los productos tienen stock suficiente.</div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((p) => {
                const isCritical = p.stock_actual === 0
                return (
                  <tr key={p.id} className={isCritical ? 'critical' : 'alert-row'}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: 700 }}>{p.stock_actual}</td>
                    <td>{p.stock_min}</td>
                    <td>
                      {isCritical ? (
                        <span className="critical-badge">Sin stock</span>
                      ) : (
                        <span className="alert-badge">Stock bajo</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
