import React from 'react'

export default function FilterBar({ sortOption, onChange, tittle }) {
  return (
    <div className="d-none d-md-flex align-items-center gap-3">
      <h2 className="mb-0 gray title-underline" style={{ position: 'relative' }}>{tittle}</h2>
      <div className="ms-auto d-flex align-items-center gap-2">
        <label className="text-muted">Ordenar:</label>
        <select className="form-select form-select" style={{ width: 220 }} value={sortOption} onChange={e => onChange(e.target.value)}>
          <option value="">Predeterminado</option>
          <option value="price-asc">Precio ↑</option>
          <option value="price-desc">Precio ↓</option>
          <option value="year-asc">Año ↑</option>
          <option value="year-desc">Año ↓</option>
        </select>
      </div>
    </div>
  )
}
