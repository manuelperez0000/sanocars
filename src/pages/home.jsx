import React, { useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterBar from '../components/FilterBar'
import VehicleList from '../components/VehicleList'
import vehiclesData from '../data/vehicles'
import { FaNewspaper } from "react-icons/fa6";
import { CiPaperplane } from "react-icons/ci";

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
            case 'price-asc': list.sort((a, b) => a.price - b.price); break
            case 'price-desc': list.sort((a, b) => b.price - a.price); break
            case 'year-asc': list.sort((a, b) => a.year - b.year); break
            case 'year-desc': list.sort((a, b) => b.year - a.year); break
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
                <VehicleList vehicles={filtered} type={"sold"} />

                <hr className='mb-5' />

                <div className="mb-4">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 mb-3">
                            <FilterBar sortOption={sortOption} onChange={setSortOption} tittle={"Vehiculos en alquiler"} />
                        </div>
                    </div>
                </div>
                <VehicleList vehicles={filtered} type={"rent"} />

            </main>

            <section className='container mt-3 mb-5 rounded bg-japon'>
                <div className='row align-items-center'>
                    <div className='col-lg-8'>
                        <h1 className='mb-4 momo'>Financiamiento</h1>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Contamos Con Financiamiento Propio Y Con Las Cuotas Mas Bajas Del Mercado.</p>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Financiamiento japonés o propio</p>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Págalo hasta en 48 meses</p>
                    </div>
                    <div className='col-lg-4 text-center'>
                        <a href="/financiamiento" className="btn btn-primary btn-lg px-4 py-3"> <FaNewspaper /> Obtener mi financiamiento</a>
                    </div>
                </div>
            </section>
            
            <section className='container my-5'>
                <h2 className='momo mb-4'>Visita Nuestra Sede</h2>
                <p className='mb-4'>Haz clic en el mapa para obtener direcciones fáciles a nuestra sede en Shizuoka, Japón usando Google Maps.</p>
                <div className='google-map'>
                    <iframe
                        src="https://maps.google.com/maps?q=4170001+Fuji+Shizuoka+Japan&output=embed"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Mapa de ubicación de SanoCars en Fuji, Shizuoka"
                    ></iframe>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Home
