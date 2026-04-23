import { useEffect, useState } from 'react'
import api from '../api'

const EMPTY_FORM = { name: '', sku: '', category: '', stock_min: '', stock_actual: '', precio_unitario: '' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/products/')
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('¿Desactivar este producto?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('No se pudo eliminar el producto.')
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      await api.post('/products/', {
        name: form.name,
        sku: form.sku,
        category: form.category,
        stock_min: Number(form.stock_min),
        stock_actual: Number(form.stock_actual),
        precio_unitario: Number(form.precio_unitario),
      })
      setShowForm(false)
      setForm(EMPTY_FORM)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Error al crear el producto.')
    } finally {
      setFormLoading(false)
    }
  }

  const categories = [...new Set(products.map((p) => p.category))]

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === '' || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1>Productos</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm((v) => !v); setFormError('') }}>
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <p className="section-title" style={{ marginTop: 0 }}>Crear nuevo producto</p>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input name="category" value={form.category} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Precio unitario (S/)</label>
              <input name="precio_unitario" type="number" min="0" step="0.01" value={form.precio_unitario} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock inicial</label>
              <input name="stock_actual" type="number" min="0" value={form.stock_actual} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock mínimo</label>
              <input name="stock_min" type="number" min="0" value={form.stock_min} onChange={handleChange} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button className="btn btn-primary" type="submit" disabled={formLoading}>
                {formLoading ? 'Guardando...' : 'Guardar producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filters">
        <input
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Stock mín.</th>
                <th>Precio unit.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty">Sin productos.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td
                      style={{
                        color: p.stock_actual <= p.stock_min ? '#e67e22' : 'inherit',
                        fontWeight: p.stock_actual <= p.stock_min ? 700 : 400,
                      }}
                    >
                      {p.stock_actual}
                    </td>
                    <td>{p.stock_min}</td>
                    <td>S/ {p.precio_unitario.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
