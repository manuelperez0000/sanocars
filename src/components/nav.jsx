import { useState } from 'react';
import { FaPhone, FaRegUserCircle, FaSearch, FaBars, FaHome, FaCar, FaTools, FaMoneyBill, FaTimes } from 'react-icons/fa';
import navLinks from '../utils/navLinks.json';
import { NavLink } from 'react-router-dom';
import useApp from '../hooks/useApp';
import { formatNumber } from '../utils/globals'; 

const Nav = () => {

    const { phones } = useApp();

    const [menuOpen, setMenuOpen] = useState(false);

    const icons = {
        FaHome,
        FaCar,
        FaTools,
        FaMoneyBill,
        FaPhone,
        FaSearch
    };

    return <>
        <div className='d-flex justify-content-between align-items-center pt-3 pb-2'>
            <div className="logo d-flex align-items-center gap-3 ">
                <NavLink to="/">
                    <img src="/logo485.svg" alt="logo" style={{ height: 48 }} />
                </NavLink>
            </div>
            <button className="btn btn-light d-md-none" onClick={() => setMenuOpen(!menuOpen)}>
                <FaBars />
            </button>
            <nav className='nav d-none d-md-flex'>
                <a href={`tel:${phones && phones.length > 0 ? phones[0].texto : '+8108091171993'}`} className='phone y-center link-white'>
                    <FaPhone /> {phones && phones.length > 0 ? formatNumber(phones[0].texto) : '080-9117-1993'}
                </a>
                <NavLink to="/login" className="y-center btn btn-primary">
                    <FaRegUserCircle />
                    Ingresa
                </NavLink>
            </nav>
        </div >
        <ul className="nav flex-center pb-3 d-none d-md-flex">
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

        <div className={menuOpen ? "d-block bg-dark p-3" : "d-none bg-dark p-3"} style={{ position: "fixed", top: "0px", height: "100vh", width: "100vw", right: 0, zIndex: 1000, overflowY: 'scroll', transition: '0.3s ease-in-out' }}>
            <div className='flex-between'>
                {/* <a href="tel:+8108091171993" className='d-block mb-2 text-white' onClick={() => setMenuOpen(false)}>
                <FaPhone /> 080-9117-1993
            </a> */}
                <NavLink to="/login" className="d-block mb-2 btn btn-primary text-decoration-none fs-4" onClick={() => setMenuOpen(false)}>
                    <FaRegUserCircle /> Ingresa
                </NavLink>
                <button onClick={() => setMenuOpen(false)} className='btn btn-dark'><FaTimes /></button>
            </div>
            {/*  <NavLink to="/empresa" className="d-block mb-2 btn btn-primary" onClick={() => setMenuOpen(false)}>
                <FaRegUserCircle /> Sobre Nosotros
            </NavLink> */}
            <hr className="my-3" />
            {navLinks.map((link, index) => {
                const Icon = icons[link.icon];
                return (
                    <NavLink
                        key={index}
                        className="d-block mb-2 text-white text-decoration-none fs-4"
                        to={link?.to}
                        onClick={() => setMenuOpen(false)}
                    >
                        <Icon /> {link?.text || ""}
                    </NavLink>
                );
            })}
        </div>
    </>
}

export default Nav
