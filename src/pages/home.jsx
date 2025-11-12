import React, { useMemo, useState } from 'react'
import Header from '../components/Header'
import FilterBar from '../components/FilterBar'
import VehicleList from '../components/VehicleList'
import vehiclesData from '../data/vehicles'

const Home = () => {
    const [vehicles] = useState(vehiclesData)
    const [filters, setFilters] = useState({ marca: '', modelo: '' })
    const [sortOption, setSortOption] = useState('')

    const handleSearch = ({ marca, modelo }) => {
        setFilters({ marca, modelo })
    }

    const filtered = useMemo(() => {
        let list = vehicles.slice()
        if (filters.marca) list = list.filter(v => v.brand === filters.marca)
        if (filters.modelo) list = list.filter(v => v.model === filters.modelo)

        switch (sortOption) {
            case 'price-asc': list.sort((a,b) => a.price - b.price); break
            case 'price-desc': list.sort((a,b) => b.price - a.price); break
            case 'year-asc': list.sort((a,b) => a.year - b.year); break
            case 'year-desc': list.sort((a,b) => b.year - a.year); break
            default: break
        }

        return list
    }, [vehicles, filters, sortOption])

    return (
        <div>
            <Header onSearch={handleSearch} />
            <main className="container my-5">
                <div className="mb-4">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 mb-3">
                            <FilterBar sortOption={sortOption} onChange={setSortOption} tittle={"Vehiculos en venta"} />
                        </div>
                    </div>
                </div>
                <VehicleList vehicles={filtered} type={"sold"}  />
                
                <hr  className='mb-5'/>

                <div className="mb-4">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 mb-3">
                            <FilterBar sortOption={sortOption} onChange={setSortOption} tittle={"Vehiculos en alquiler"} />
                        </div>
                    </div>
                </div>
                <VehicleList vehicles={filtered} type={"rent"} />

            </main>
        </div>
    )
}

export default Home