import { Link } from 'react-router-dom'
import useCategoriasServicio from '../hooks/useCategoriasServicio'
import { hostUrl } from '../utils/globals'

const Services = () => {
    const { categorias, loading, error } = useCategoriasServicio()

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
            <div className='row g-2'>
                {categorias.map((categoria) => (
                    <div key={categoria.id} className='col-6 col-md-4 mb-4'>

                        <div className='mb-2'>
                            <Link to={`/service/${categoria.id}`}>
                                <img src={`${hostUrl}/uploads/${categoria.imagen}`} alt={categoria.titulo} className='img-fluid rounded service-image' />
                            </Link>
                        </div>
                        <Link to={`/service/${categoria.id}`} className='text-decoration-none gray'>
                            <h5 className='card-title'>{categoria.titulo} {">"}</h5>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    </>
}

export default Services
