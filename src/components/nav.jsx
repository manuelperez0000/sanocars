import { FaPhone, FaRegUserCircle, FaSearch } from 'react-icons/fa';
import navLinks from '../utils/navLinks.json';
import { NavLink } from 'react-router-dom';

const Nav = () => {
    return <>
        <div className='d-flex justify-content-between align-items-center pt-3 pb-2'>
            <div className="logo d-flex align-items-center gap-3 ">
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
                <NavLink to="/empresa" className="y-center btn btn-primary">
                    <FaRegUserCircle />
                    Sobre Nosotros
                </NavLink>
            </nav>
        </div >
        <ul className="nav flex-center pb-3">
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
    </>
}

export default Nav
