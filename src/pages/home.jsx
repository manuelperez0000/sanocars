import React, { useMemo, useState } from 'react'
import Header from '../components/Header'
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
                <h2 className='momo mb-5'>Nuestros Servicios</h2>
                <div className='row'>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>1️⃣ Mecánica Automotriz</h5>
                                <ul className='list-unstyled'>
                                    <li>• 🔧 Mantenimiento general</li>
                                    <li>• ⚙️ Diagnóstico computarizado</li>
                                    <li>• 🛠️ Reparación en general</li>
                                    <li>• 🔋 Sistema eléctrico</li>
                                    <li>• 🧊 Sistema de refrigeración y aire acondicionado</li>
                                </ul>
                                <p className='card-text small'>En este apartado puedes agregar fotos de tu taller, herramientas y vehículos en reparación.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>2️⃣ Planchado y Pintura</h5>
                                <ul className='list-unstyled'>
                                    <li>• 🎨 Reparación de carrocería y abolladuras</li>
                                    <li>• 🧽 Pintura automotriz profesional</li>
                                    <li>• 🪶 Pulido, encerado y detailing</li>
                                    <li>• 🧱 Restauración de faros y acabados</li>
                                    <li>• 🖌️ Personalización y retoques estéticos</li>
                                </ul>
                                <p className='card-text small'>Ideal incluir antes y después en imágenes.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>3️⃣ Grúa 24 Horas</h5>
                                <ul className='list-unstyled'>
                                    <li>• 🚨 Asistencia vial inmediata</li>
                                    <li>• 🚚 Remolque local y regional</li>
                                    <li>• 🕐 Disponibilidad 24/7 en toda la zona de Shizuoka</li>
                                    <li>• 🧾 Traslado a taller o domicilio</li>
                                    <li>• 📞 Contacto directo de emergencia (WhatsApp o llamada rápida)</li>
                                </ul>
                                <a href="tel:+1234567890" className="btn btn-success">Llamar ahora</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>4️⃣ Documentación</h5>
                                <ul className='list-unstyled'>
                                    <li>• 🪪 Cambio de nombre y transferencia</li>
                                    <li>• 🧾 Cambio de placa</li>
                                    <li>• 📋 Inspección técnica (Shaken)</li>
                                    <li>• 🏦 Gestión de seguro vehicular</li>
                                </ul>
                                <p className='card-text small'>Puedes destacar que hablas español y japonés para ayudar a latinos residentes.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>5️⃣ Renta Car</h5>
                                <ul className='list-unstyled'>
                                    <li>• 🚗 Autos compactos y kei car</li>
                                    <li>• 🚙 Minivan y familiares</li>
                                    <li>• 🕓 Renta por día, semana o mes</li>
                                    <li>• 💳 Reservas y requisitos (licencia japonesa o internacional)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                footer
            </footer>
        </div>
    )
}

export default Home
