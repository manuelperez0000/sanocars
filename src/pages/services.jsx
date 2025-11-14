import servicesData from '../data/services'
import { Link } from 'react-router-dom'

const Services = () => {

    return <>
        <section className='container my-5'>
            <h2 className='momo mb-5'>Nuestros Servicios</h2>
            <div className='row g-2'>
                {servicesData.map((service, index) => (
                    <div key={index} className='col-6 col-md-4 mb-4'>

                        <div className='mb-2'>
                            <Link to={`/service/${service.id}`}>
                                <img src={service.image} alt={service.title} className='img-fluid rounded service-image' />
                            </Link>
                        </div>
                        <Link to={`/service/${service.id}`} className='text-decoration-none gray'>
                            <h5 className='card-title'>{service.title} {">"}</h5>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    </>
}

export default Services
