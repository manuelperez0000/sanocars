import React from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUsers, FaAward, FaCar, FaTools } from 'react-icons/fa'

const Empresa = () => {
    return (
        <div className="empresa-page">
            <div className="container py-5">
                {/* Hero Section */}
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h1 className="display-4 momo mb-4">Sobre SanoCars</h1>
                        <p className="lead">Tu taller de confianza en Shizuoka, Japón</p>
                    </div>
                </div>

                {/* Company Description */}
                <div className="row mb-5">
                    <div className="col-lg-8 mx-auto">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h2 className="h3 mb-4 text-center">Nuestra Historia</h2>
                                <p className="mb-4">
                                    SanoCars es un taller automotriz especializado en el mantenimiento, reparación y pintura de vehículos.
                                    Fundada en Shizuoka, Japón, nos dedicamos a proporcionar servicios de alta calidad con la experiencia
                                    y profesionalismo que nuestros clientes merecen.
                                </p>
                                <p className="mb-4">
                                    Nuestro equipo de mecánicos certificados y pintores expertos utiliza equipos de última tecnología
                                    y técnicas avanzadas para garantizar que tu vehículo reciba el mejor cuidado posible.
                                </p>
                                <p>
                                    Con años de experiencia en el sector automotriz, hemos construido una reputación basada en la
                                    confianza, la calidad y el servicio al cliente excepcional.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Overview */}
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="h3 mb-4 text-center">Nuestros Servicios</h2>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card h-100 text-center shadow">
                            <div className="card-body">
                                <FaTools size={40} className="text-primary mb-3" />
                                <h5 className="card-title">Mecánica Automotriz</h5>
                                <p className="card-text">Mantenimiento completo y reparaciones especializadas para todo tipo de vehículos.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card h-100 text-center shadow">
                            <div className="card-body">
                                <FaCar size={40} className="text-primary mb-3" />
                                <h5 className="card-title">Planchado y Pintura</h5>
                                <p className="card-text">Restauración completa de la carrocería con técnicas profesionales de pintura.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card h-100 text-center shadow">
                            <div className="card-body">
                                <FaClock size={40} className="text-primary mb-3" />
                                <h5 className="card-title">Grúa 24 Horas</h5>
                                <p className="card-text">Servicio de grúa disponible las 24 horas del día para emergencias.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <div className="card h-100 text-center shadow">
                            <div className="card-body">
                                <FaUsers size={40} className="text-primary mb-3" />
                                <h5 className="card-title">Renta Car</h5>
                                <p className="card-text">Vehículos de reemplazo disponibles mientras reparas el tuyo.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="h3 mb-4 text-center">¿Por qué elegir SanoCars?</h2>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center">
                            <FaAward size={50} className="text-primary mb-3" />
                            <h5>Experiencia</h5>
                            <p>Años de experiencia en el sector automotriz japonés</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center">
                            <FaUsers size={50} className="text-primary mb-3" />
                            <h5>Profesionalismo</h5>
                            <p>Equipo certificado y capacitado continuamente</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center">
                            <FaCar size={50} className="text-primary mb-3" />
                            <h5>Calidad</h5>
                            <p>Utilizamos las mejores técnicas y materiales</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="row">
                    <div className="col-12">
                        <h2 className="h3 mb-4 text-center">Información de Contacto</h2>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Ubicación</h5>
                                <p className="mb-2">
                                    <FaMapMarkerAlt className="me-2" />
                                    Shizuoka, Japón
                                </p>
                                <p className="mb-2">
                                    <FaPhone className="me-2" />
                                    <a href="tel:+08091171993" className="text-decoration-none">080 9117 1993</a>
                                </p>
                                <p className="mb-0">
                                    <FaEnvelope className="me-2" />
                                    <a href="mailto:sanocars@hotmail.com" className="text-decoration-none">sanocars@hotmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Horarios de Atención</h5>
                                <p className="mb-2">
                                    <FaClock className="me-2" />
                                    Lunes - Viernes: 8:00 AM - 6:00 PM
                                </p>
                                <p className="mb-2">
                                    <FaClock className="me-2" />
                                    Sábados: 8:00 AM - 4:00 PM
                                </p>
                                <p className="mb-0">
                                    <FaClock className="me-2" />
                                    Domingos: Cerrado
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Empresa
