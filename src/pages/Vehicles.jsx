import { useEffect, useState } from 'react'
import { FaShoppingCart, FaCalendarAlt } from 'react-icons/fa'
import VehicleList from '../components/VehicleList'
import request from '../utils/request'
import { apiurl } from '../utils/globals'
/* import vehicles from '../data/vehicles' */

const Vehicles = () => {
    const [filterType, setFilterType] = useState('sold') // 'venta' or 'alquiler'
    
    const [vehiclesForSale, setVehiclesForSale] = useState([])
    const [vehiclesForRent, setVehiclesForRent] = useState([])

    const getVehicles = async () => {
        const resp = await request.get(apiurl + '/vehicles')
        if (resp?.data?.body) {
            const allVehicles = resp.data.body
            const sale = allVehicles.filter(v => v.status === 'En Venta')
            const rent = allVehicles.filter(v => v.status === 'En alquiler')
            setVehiclesForSale(sale)
            setVehiclesForRent(rent)
        }
    }

    useEffect(() => {
        getVehicles()
    }, [])

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
                                    value="sold"
                                    checked={filterType === 'sold'}
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
                                    value="rent"
                                    checked={filterType === 'rent'}
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
                        vehicles={filterType === 'rent' ? vehiclesForRent : vehiclesForSale}
                        type={filterType}
                    />
                </div>
            </div>
        </div>
    )
}

export default Vehicles
