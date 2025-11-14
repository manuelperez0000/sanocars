import { useParams, Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import servicesData from '../data/services.js'
import mecanica from "../../public/services/mecanica.webp"
import pintura from "../../public/services/pintura.webp"
import grua from "../../public/services/grua.webp"
import document from "../../public/services/document.webp"
import rent from "../../public/services/rent.jpg"

const imagesOBJ = {
    "mecanica-general": mecanica,
    "planchado-y-pintura": pintura,
    "grua-24-horas": grua,
    "documentacion": document,
    "renta-car": rent
}

const Service = () => {
    const { id } = useParams()
    const service = servicesData.find(s => s.id === id)

    const handleClick = () => {
        const phoneNumber = "+08091171993"
        const message = `quiero contratar el servicio de "${service.title}"`
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    if (!service) {
        return <div className='container my-5'>Servicio no encontrado</div>
    }

    return (
        <div className='container my-5'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/services">Services</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{service.title}</li>
                </ol>
            </nav>
            <h1 className='momo mb-4'>{service.title}</h1>
            <div className='row'>
                <div className='col-md-6'>
                    <img src={imagesOBJ[service.id]} alt={service.title} className='img-fluid rounded service-image' />
                </div>
                <div className='col-md-6'>
                    <h3>Servicios incluidos:</h3>
                    <ul className='list-unstyled'>
                        {service.services.map((item, idx) => (
                            <li key={idx} className='mb-2'>• {item}</li>
                        ))}
                    </ul>
                    <button className='btn btn-primary' onClick={handleClick}> <FaWhatsapp /> Contratar este servicio </button>
                </div>
            </div>
        </div>
    )
}

export default Service
