import { useEffect, useState } from 'react'
import api from '../api'

export default function Movements() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ product_id: '', tipo: 'entrada', cantidad: '', motivo: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/products/').then(({ data }) => setProducts(data))
  }, [])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.product_id) { setError('Seleccioná un producto.'); return }
    setLoading(true)
    try {
      await api.post('/movements/', {
        product_id: Number(form.product_id),
        tipo: form.tipo,
        cantidad: Number(form.cantidad),
        motivo: form.motivo || null,
      })
      setSuccess('Movimiento registrado correctamente.')
      setForm({ product_id: '', tipo: 'entrada', cantidad: '', motivo: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar el movimiento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Registrar Movimiento</h1>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Producto</label>
            <select name="product_id" value={form.product_id} onChange={handleChange} required>
              <option value="">Seleccioná un producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — Stock: {p.stock_actual}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de movimiento</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="ajuste">Ajuste (stock fijo)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={form.tipo === 'ajuste' ? 0 : 1}
              required
            />
          </div>

          <div className="form-group">
            <label>Motivo (opcional)</label>
            <input
              type="text"
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              placeholder="ej. Compra proveedor, Venta cliente..."
            />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar movimiento'}
          </button>
        </form>
      </div>
    </div>
  )
}
