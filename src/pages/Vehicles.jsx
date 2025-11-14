import { useState } from 'react'
import { FaShoppingCart, FaCalendarAlt } from 'react-icons/fa'
import VehicleList from '../components/VehicleList'
import vehicles from '../data/vehicles'
import PageLayout from '../components/PageLayout'

const Vehicles = () => {
    const [filterType, setFilterType] = useState('venta') // 'venta' or 'alquiler'

    const handleFilterChange = (event) => {
        setFilterType(event.target.value)
    }

    return (
        <div className="container-fluid py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    {/* Header Section */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
                        <h2 className="momo">Nuestros Vehículos</h2>

                        {/* Filter Section */}
                        <div className="d-flex justify-content-center">
                            <div className="btn-group btn-group" role="group">
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="vehicleType"
                                    id="venta"
                                    value="venta"
                                    checked={filterType === 'venta'}
                                    onChange={handleFilterChange}
                                />
                                <label className="btn btn-outline-dark flex-center gap-2" htmlFor="venta">
                                    <FaShoppingCart /> Vehículos en Venta
                                </label>

                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="vehicleType"
                                    id="alquiler"
                                    value="alquiler"
                                    checked={filterType === 'alquiler'}
                                    onChange={handleFilterChange}
                                />
                                <label className="btn btn-outline-dark flex-center gap-2" htmlFor="alquiler">
                                    <FaCalendarAlt /> Vehículos en Alquiler
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle List */}
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
