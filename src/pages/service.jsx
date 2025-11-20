import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { FaWhatsapp, FaCalendarAlt } from 'react-icons/fa'
import servicesData from '../data/services.js'
import request from '../utils/request.js'
import mecanica from "../../public/services/mecanica.webp"
import pintura from "../../public/services/pintura.webp"
import grua from "../../public/services/grua.webp"
import document from "../../public/services/document.jpeg"
import rent from "../../public/services/rent.jpg"
import { apiurl } from '../utils/globals.js'

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
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: ''
    })

    const handleClick = () => {
        const phoneNumber = "+8108091171993"
        const message = `quiero contratar el servicio de "${service.title}"`
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    const openModal = () => {
        setModalOpen(true)
        setSelectedDate('')
        setShowForm(false)
        setFormData({ nombre: '', email: '', telefono: '' })
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value)
        if (e.target.value) {
            setShowForm(true)
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleScheduleAppointment = async () => {
        try {
            const reservationData = {
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono,
                servicio: service.title,
                fecha_reserva: selectedDate
            }

            const response = await request.post(apiurl + '/services/reserve', reservationData)

            if (response.data.status === 200) {
                alert('Reserva guardada exitosamente')
                closeModal()
            } else {
                alert('Error al guardar la reserva: ' + response.data.message)
            }
        } catch (error) {
            console.error('Error saving reservation:', error)
            alert('Error al guardar la reserva. Por favor, inténtelo de nuevo.')
        }
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
                    <div className='d-flex gap-2'>
                        <button className='btn btn-primary' onClick={handleClick}> <FaWhatsapp /> Contratar este servicio </button>
                        <button className='btn btn-outline-primary' onClick={openModal}> <FaCalendarAlt /> Reserve una cita </button>
                    </div>
                </div>
            </div>

            {/* Modal for appointment scheduling */}
            {modalOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reservar Cita - {service.title}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {!showForm ? (
                                    <div>
                                        <h6>Selecciona una fecha:</h6>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <h6>Fecha seleccionada: {selectedDate}</h6>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email:</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Teléfono:</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                {showForm && (
                                    <button type="button" className="btn btn-primary" onClick={handleScheduleAppointment}>
                                        Agendar mi cita
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Service
