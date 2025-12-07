import VehicleCard from './VehicleCard'

export default function VehicleList({ vehicles, scroll = false }) {
  if (!vehicles || vehicles.length === 0) return <p className="text-muted">No hay vehículos para mostrar.</p>

  if (scroll) {
    return (
      <div className="horizontal-scroll-container" style={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        gap: '1rem',
        paddingBottom: '1rem',
        scrollbarWidth: 'thin',
        scrollbarColor: '#6c757d #f8f9fa'
      }}>
        {vehicles.map(v => v.status != 'eliminado' && (
          <div key={v.id} style={{
            flex: '0 0 auto',
            width: '300px',
            minWidth: '300px'
          }}>
            <VehicleCard v={v} />
          </div>
        ))}
      </div>
    )
  }

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
