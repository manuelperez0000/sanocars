import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import { FaPhone, FaRegUserCircle, FaSearch } from 'react-icons/fa';
import navLinks from '../utils/navLinks.json';
const Header = ({ onSearch }) => {
    return (
        <header className="home-header text-white">
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-between align-items-center pt-5 pb-2">
                        <div className="logo d-flex align-items-center gap-3">
                            <img src="/logo485.svg" alt="logo" style={{ height: 48 }} />
                        </div>
                        <nav className='nav'>
                            <a href="tel:08091171993" className='phone y-center link-white'>
                                <FaPhone /> 080-9117-1993
                            </a>
                            <NavLink to="/login" className="y-center link-white">
                                <FaRegUserCircle />
                                Ingresa
                            </NavLink>
                            <NavLink to="/login" className="y-center btn btn-primary">
                                <FaRegUserCircle />
                                Consigue un financiamiento
                            </NavLink>
                        </nav>
                    </div>
                    <div className="col-12 flex-center">
                        <ul className="nav">
                            {navLinks.map((link, index) => (
                                <NavLink
                                    key={index}
                                    className={({ isActive }) => `nav-item nav-link text-white y-center ${isActive ? 'active' : ''}`}
                                    to={link.to}
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-12 text-center">
                        <h1 className="text-header-h1 momo">Encuentra el vehículo de tus sueños</h1>
                        <div className="lead">Te acompañamos en mantenimiento reparación y pintura de tu vehiculo.
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <SearchBar onSearch={onSearch} />
                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header
