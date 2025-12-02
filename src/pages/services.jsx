import { Link } from 'react-router-dom'
import useCategoriasServicio from '../hooks/useCategoriasServicio'
import { apiurl, topurl } from '../utils/globals'
import { FaTools, FaCar, FaPaintBrush, FaFileAlt, FaTruck, FaCog } from 'react-icons/fa'
import { FaLongArrowAltRight } from "react-icons/fa";

const Services = () => {
    const { categorias, loading, error } = useCategoriasServicio()

    const getServiceIcon = (titulo) => {
        const iconMap = {
            'mecánica': FaTools,
            'pintura': FaPaintBrush,
            'documentos': FaFileAlt,
            'grúa': FaTruck,
            'renta': FaCar,
        }
        const lowerTitle = titulo.toLowerCase()
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerTitle.includes(key)) {
                return icon
            }
        }
        return FaCog // default icon
    }

    if (loading) {
        return (
            <section className='container my-5'>
                <h2 className='momo mb-5'>Nuestros Servicios</h2>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className='container my-5'>
                <h2 className='momo mb-5'>Nuestros Servicios</h2>
                <div className="alert alert-danger">
                    Error: {error}
                </div>
            </section>
        )
    }

    return <>
        <section className='container my-5'>
            <h2 className='momo mb-5'>Nuestros Servicios</h2>
            <div className='row g-4 text-center justify-content-center'>
                {categorias.map((categoria) => {
                    /* const IconComponent = getServiceIcon(categoria.titulo) */
                    return (
                        <div key={categoria.id} className='col-12 col-sm-6 col-lg-4'>
                            <div className='card h-100 shadow-sm border-0 service-card'>
                                <div className='card-body d-flex flex-column'>

                                    <div className='mb-2'>
                                        <Link to={`/service/${categoria.id}`} className='text-decoration-none'>
                                            <img src={`${topurl}/uploads/${categoria.imagen}`} alt={categoria.titulo} className='img-fluid rounded service-image' />
                                        </Link>
                                    </div>
                                    <div className='mt-auto'>
                                        <Link to={`/service/${categoria.id}`} className='text-decoration-none text-dark'>
                                            <h5 className='card-title text-center fw-bold'>{categoria.titulo}</h5>
                                        </Link>
                                        {/* <div className='text-center mt-2'>
                                            <Link to={`/service/${categoria.id}`} className='btn btn-outline-primary btn-sm'>
                                                Ver más <span className='ms-1'><FaLongArrowAltRight /></span>
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    </>
}

export default Services
