/* import { useState } from 'react' */
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import VehicleList from '../components/VehicleList'
import useHome from '../hooks/useHome'
import useVisits from '../hooks/useVisits'
import { FaNewspaper } from "react-icons/fa6";
import { CiPaperplane } from "react-icons/ci";
import { FaWrench, FaPaintBrush, FaTruck, FaFileAlt, FaCar } from "react-icons/fa";
import WhatsAppButton from '../components/WhatsAppButton'
/* import FilterBar from '../components/FilterBar' */

const Home = () => {
    const { vehiclesForSale, vehiclesForRent, vehiclesSold } = useHome()
    const { visitCount } = useVisits()
    /* const [filters, setFilters] = useState({ marca: '', modelo: '' }) */
    /* const [sortOption, setSortOption] = useState('') */

    /* const handleSearch = ({ marca, modelo }) => {
        setFilters({ marca, modelo })
    } */

    /* const filteredSale = useMemo(() => {
        let list = vehiclesForSale.slice()
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
    }, [vehiclesForSale, filters, sortOption])

    const filteredRent = useMemo(() => {
        let list = vehiclesForRent.slice()
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
    }, [vehiclesForRent, filters, sortOption]) */

    return (
        <div>
            <Header />
            <main className="container my-5">

                <div className="mb-4">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 mb-3">
                            <h2 className="mb-0 gray title-underline" style={{ position: 'relative' }}>Vehiculos en venta</h2>
                            {/* <FilterBar sortOption={sortOption} onChange={setSortOption} tittle={"Vehiculos en venta"} /> */}
                        </div>
                    </div>
                </div>
                <VehicleList vehicles={vehiclesForSale} />

                <hr className='mb-5' />

                <div className="mb-4">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 mb-3">

                            <h2 className="mb-0 gray title-underline" style={{ position: 'relative' }}>Vehiculos en alquiler</h2>
                            {/* <FilterBar sortOption={sortOption} onChange={setSortOption} tittle={"Vehiculos en alquiler"} /> */}
                        </div>
                    </div>
                </div>
                <VehicleList vehicles={vehiclesForRent} />

                <hr className='mb-5' />

                <div className="mb-4">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 mb-3">

                            <h2 className="mb-0 gray title-underline" style={{ position: 'relative' }}>Vehiculos vendidos</h2>
                            {/* <FilterBar sortOption={sortOption} onChange={setSortOption} tittle={"Vehiculos en alquiler"} /> */}
                        </div>
                    </div>
                </div>
                <VehicleList vehicles={vehiclesSold} />

            </main>

            <section className='container my-5'>
                <h2 className='momo mb-5'> Nuestros Servicios </h2>

                <div className='row mb-4'>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <h5 className='card-title mb-3'><Link to="/services" className="text-decoration-none text-dark">Mecánica Automotriz</Link></h5>
                        <div className='row align-items-start'>
                            <div className='col-auto'>
                                <FaWrench size={40} />
                            </div>
                            <div className='col'>
                                <ul className='list-unstyled'>
                                    <li>• Mantenimiento general</li>
                                    <li>• Diagnóstico computarizado</li>
                                    <li>• Reparación en general</li>
                                    <li>• Sistema eléctrico</li>
                                    <li>• Sistema de refrigeración y aire acondicionado</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <h5 className='card-title mb-3'><Link to="/services" className="text-decoration-none text-dark">Planchado y Pintura</Link></h5>
                        <div className='row align-items-start'>
                            <div className='col-auto'>
                                <FaPaintBrush size={40} />
                            </div>
                            <div className='col'>
                                <ul className='list-unstyled'>
                                    <li>• Reparación de carrocería y abolladuras</li>
                                    <li>• Pintura automotriz profesional</li>
                                    <li>• Pulido, encerado y detailing</li>
                                    <li>• Restauración de faros y acabados</li>
                                    <li>• Personalización y retoques estéticos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <h5 className='card-title mb-3'><Link to="/services" className="text-decoration-none text-dark">Grúa 24 Horas</Link></h5>
                        <div className='row align-items-start'>
                            <div className='col-auto'>
                                <FaTruck size={40} />
                            </div>
                            <div className='col'>
                                <ul className='list-unstyled'>
                                    <li>• Asistencia vial inmediata</li>
                                    <li>• Remolque local y regional</li>
                                    <li>• Disponibilidad 24/7 en toda la zona de Shizuoka</li>
                                    <li>• Traslado a taller o domicilio</li>
                                    <li>• Contacto directo de emergencia</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <h5 className='card-title mb-3'><Link to="/services" className="text-decoration-none text-dark">Documentación</Link></h5>
                        <div className='row align-items-start'>
                            <div className='col-auto'>
                                <FaFileAlt size={40} />
                            </div>
                            <div className='col'>
                                <ul className='list-unstyled'>
                                    <li>• Cambio de nombre y transferencia</li>
                                    <li>• Cambio de placa</li>
                                    <li>• Inspección técnica (Shaken)</li>
                                    <li>• Gestión de seguro vehicular</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-6 mb-4'>
                        <h5 className='card-title mb-3'><Link to="/services" className="text-decoration-none text-dark">Renta Car</Link></h5>
                        <div className='row align-items-start'>
                            <div className='col-auto'>
                                <FaCar size={40} />
                            </div>
                            <div className='col'>
                                <ul className='list-unstyled'>
                                    <li>• Autos compactos y kei car</li>
                                    <li>• Minivan y familiares</li>
                                    <li>• Renta por día, semana o mes</li>
                                    <li>• Reservas y requisitos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container mt-3 mb-5 rounded bg-japon'>
                <div className='row align-items-center'>
                    <div className='col-lg-8'>
                        <h2 className='mb-4 momo'>Financiamiento</h2>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Financiamiento Japonés</p>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Financiamiento Propio </p>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Pago de mensualidad flexible</p>
                        <p className='text-financiamiento mb-3 text-l'><CiPaperplane /> Financiamiento fácil de aprobación</p>
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
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d203.9048324347042!2d138.7919401!3d35.1447149!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601bd53078fbc43b%3A0x32db989d7ae88ecd!2z5qCq5byP5Lya56S-U2Fub2NhcnM!5e0!3m2!1ses-419!2sve!4v1763062893744!5m2!1ses-419!2sve"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Mapa de ubicación de SanoCars en Fuji, Shizuoka"
                    ></iframe>
                </div>
            </section>
            <WhatsAppButton />
            <Footer visitCount={visitCount} />
        </div>
    )
}

export default Home
