import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import objVehicles from '../utils/objVehicles.json'
import useHome from '../hooks/useHome'

export default function SearchBar() {
  const { allVehicles } = useHome()
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const navigate = useNavigate()

  // Get unique brands from allVehicles
  const availableBrands = objVehicles.vehicles.filter(vehicle =>
    allVehicles.some(v => v.marca === vehicle.name)
  )

  // Get unique models for the selected brand from allVehicles
  const availableModels = marca ? marca.models.filter(model =>
    allVehicles.some(v => v.marca === marca.name && v.modelo === model)
  ) : []

  const handleSearch = (e) => {
    e.preventDefault()
    if (marca && modelo) {
      navigate(`/search?marca=${encodeURIComponent(marca.name)}&modelo=${encodeURIComponent(modelo)}`)
    }
  }

  return (
    <div className='card p-4 bg-search mt-5'>

      <h4>Buscar un vehiculo</h4>
      <form className="row gy-2 gx-2 align-items-center" onSubmit={handleSearch}>
        <div className="col-sm-5">
          <select className="form-select form-select-lg" value={marca ? JSON.stringify(marca) : ''} onChange={e => { setMarca(e.target.value ? JSON.parse(e.target.value) : ''); setModelo('') }}>
            <option value="">Marca</option>
            {availableBrands.map(m => <option key={m.name} value={JSON.stringify(m)}>{m.name}</option>)}
          </select>
        </div>
        <div className="col-sm-5">
          <select className="form-select form-select-lg" value={modelo} onChange={e => setModelo(e.target.value)}>
            <option value="">Modelo</option>
            {marca && availableModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="col-sm-2 d-grid">
          <button className="btn btn-primary btn-lg">Buscar</button>
        </div>
      </form>
    </div>
  )
}
