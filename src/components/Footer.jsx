import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="footer-dark">
            <div className="container">
                <div className="row py-5">
                    {/* Logo */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="logo-section mb-3">
                            <img src="/logo485.svg" alt="logo" style={{ height: 48 }} />
                        </div>
                        <div className="social-iconsr">
                            <a href="#" className="social-link me-3">
                                <FaInstagram size={30} />
                            </a>
                            <a href="#" className="social-link me-3">
                                <FaFacebook size={30} />
                            </a>
                            <a href="#" className="social-link">
                                <FaWhatsapp size={30} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="footer-title mb-3">Información de Contacto</h5>
                        <ul className="footer-nav">
                            <li className="mb-2">
                                <FaEnvelope className="me-2" />
                                <a href="mailto:info@sanocars.com" className="footer-link">info@sanocars.com</a>
                            </li>
                            <li className="mb-2">
                                <FaPhone className="me-2" />
                                <a href="tel:+811234567890" className="footer-link">+81 123 456 7890</a>
                            </li>
                            <li className="mb-2">
                                <FaMapMarkerAlt className="me-2" />
                                <span className="footer-link">Shizuoka, Japón</span>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation Links */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="footer-title mb-3">Enlaces de Interés</h5>
                        <ul className="footer-nav">
                            <li><NavLink to="/" className="footer-link">Inicio</NavLink></li>
                            <li><NavLink to="/" className="footer-link">Servicios</NavLink></li>
                            <li><NavLink to="/financiamiento" className="footer-link">Financiamiento</NavLink></li>
                            <li><NavLink to="/contacto" className="footer-link">Contacto</NavLink></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="footer-title mb-3">Nuestros Servicios</h5>
                        <ul className="footer-nav">
                            <li className="mb-2"><span className="footer-link">🔧 Mecánica Automotriz</span></li>
                            <li className="mb-2"><span className="footer-link">🎨 Planchado y Pintura</span></li>
                            <li className="mb-2"><span className="footer-link">🚨 Grúa 24 Horas</span></li>
                            <li className="mb-2"><span className="footer-link">📋 Documentación</span></li>
                            <li className="mb-2"><span className="footer-link">🚗 Renta Car</span></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="row">
                    <div className="col-12">
                        <hr className="footer-divider" />
                        <p className="copyright text-center">
                            © {new Date().getFullYear()} SanoCars. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
