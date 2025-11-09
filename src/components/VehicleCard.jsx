import React from 'react'
import { Link } from 'react-router-dom'

export default function VehicleCard({ v }) {
  return (
    <Link to={`/vehiculo/${v.id}`} className="text-decoration-none text-reset">
      <div className="card shadow-sm mb-4 vehicle-card h-100">
        <img src={v.images && v.images[0] ? v.images[0] : v.image} alt={v.name} className="card-img-top vehicle-card-img" />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-1">{v.name} <small className="text-muted">({v.year})</small></h5>
          <p className="mb-1">{v.engine} L</p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="h6 text-danger mb-0">${v.price.toLocaleString()}</span>
            <span className="text-muted ms-2">{v.km.toLocaleString()} km</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
