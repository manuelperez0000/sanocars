import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formData)
        alert('¡Gracias por contactarnos! Te responderemos pronto.')
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        })
    }

    return (
        <div className="container py-5">
            <div className="row">
                {/* Contact Information */}
                <div className="col-lg-6 mb-5">
                    <h2 className="momo mb-4">Información de Contacto</h2>
                    <p className="mb-4">Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros servicios automotrices.</p>

                    <div className="contact-info">
                        <div className="d-flex align-items-center mb-3">
                            <FaEnvelope className="me-3 text-primary" size={24} />
                            <div>
                                <h6 className="mb-1">Email</h6>
                                <a href="mailto:info@sanocars.com" className="text-decoration-none">info@sanocars.com</a>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                            <FaPhone className="me-3 text-primary" size={24} />
                            <div>
                                <h6 className="mb-1">Teléfono</h6>
                                <a href="tel:+811234567890" className="text-decoration-none">+81 123 456 7890</a>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-4">
                            <FaMapMarkerAlt className="me-3 text-primary" size={24} />
                            <div>
                                <h6 className="mb-1">Ubicación</h6>
                                <span>Shizuoka, Japón</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="social-media">
                        <h6 className="mb-3">Síguenos en redes sociales</h6>
                        <div className="d-flex">
                            <a href="#" className="me-3 text-primary">
                                <FaInstagram size={30} />
                            </a>
                            <a href="#" className="me-3 text-primary">
                                <FaFacebook size={30} />
                            </a>
                            <a href="#" className="text-primary">
                                <FaWhatsapp size={30} />
                            </a>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mt-4">
                        <h6 className="mb-3">Nuestra Ubicación</h6>
                        <div className="google-map">
                            <iframe
                                src="https://maps.google.com/maps?q=4170001+Fuji+Shizuoka+Japan&output=embed"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Mapa de ubicación de SanoCars en Fuji, Shizuoka"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="col-lg-6">
                    <h2 className="momo mb-4">Envíanos un Mensaje</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre Completo *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico *</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="subject" className="form-label">Asunto *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Mensaje *</label>
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg">
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
