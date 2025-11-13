import { NavLink } from 'react-router-dom'
import { FaPhone, FaRegUserCircle } from 'react-icons/fa';
import navLinks from '../utils/navLinks.json';
import Footer from './Footer';

const PageLayout = ({ children }) => {
    return (
        <>
            {/* Header with dark background */}
            <header className="page-header bg-dark text-white py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="logo d-flex align-items-center gap-3">
                                <img src="/logo485.svg" alt="logo" style={{ height: 48 }} />
                            </div>
                            <nav className='nav align-items-center'>
                                <a href="tel:08091171993" className='phone y-center link-white me-3'>
                                    <FaPhone /> 080-9117-1993
                                </a>
                                <NavLink to="/login" className="y-center link-white me-3">
                                    <FaRegUserCircle />
                                    Ingresa
                                </NavLink>
                                <NavLink to="/login" className="y-center btn btn-primary">
                                    <FaRegUserCircle />
                                    Consigue un financiamiento
                                </NavLink>
                            </nav>
                        </div>
                        <div className="col-12 mt-3">
                            <ul className="nav justify-content-center">
                                {navLinks.map((link, index) => (
                                    <NavLink
                                        key={index}
                                        className={({ isActive }) => `nav-item nav-link text-white ${isActive ? 'active' : ''}`}
                                        to={link.to}
                                    >
                                        {link.text}
                                    </NavLink>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default PageLayout
