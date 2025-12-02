import VehicleCard from './VehicleCard'

export default function VehicleList({ vehicles }) {
  if (!vehicles || vehicles.length === 0) return <p className="text-muted">No hay vehículos para mostrar.</p>

  return (
    <div className="row">
      {vehicles.map(v => v.status != 'eliminado' && (

        <div key={v.id} className="col-12 col-sm-6 col-md-4 mb-4">
          <VehicleCard v={v} />
        </div>
      ))}
    </div>
  )
}
