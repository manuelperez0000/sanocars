import React from 'react'
import VehicleCard from './VehicleCard'

export default function VehicleList({ vehicles }) {
  if (!vehicles || vehicles.length === 0) return <p className="text-muted">No hay vehículos para mostrar.</p>

  return (
    <div className="row">
      {vehicles.map(v => (
        <div key={v.id} className="col-12 col-sm-6 col-md-3">
          <VehicleCard v={v} />
        </div>
      ))}
    </div>
  )
}
