import { useState } from 'react'
import VehicleList from '../components/VehicleList'
import vehicles from '../data/vehicles'

const Vehicles = () => {
    const [filterType, setFilterType] = useState('venta') // 'venta' or 'alquiler'

    const handleFilterChange = (event) => {
        setFilterType(event.target.value)
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center mb-4">Vehículos</h1>

                    {/* Radio buttons for filtering */}
                    <div className="d-flex justify-content-center mb-4">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="vehicleType"
                                id="venta"
                                value="venta"
                                checked={filterType === 'venta'}
                                onChange={handleFilterChange}
                            />
                            <label className="form-check-label" htmlFor="venta">
                                Vehículos en Venta
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="vehicleType"
                                id="alquiler"
                                value="alquiler"
                                checked={filterType === 'alquiler'}
                                onChange={handleFilterChange}
                            />
                            <label className="form-check-label" htmlFor="alquiler">
                                Vehículos en Alquiler
                            </label>
                        </div>
                    </div>

                    {/* Vehicle list */}
                    <VehicleList
                        vehicles={vehicles}
                        type={filterType === 'alquiler' ? 'rent' : 'sale'}
                    />
                </div>
            </div>
        </div>
    )
}

export default Vehicles
