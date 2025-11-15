import { Link, useLocation } from 'react-router-dom'
import { FaTachometerAlt, FaUsers, FaMoneyBillWave, FaCar, FaTools } from 'react-icons/fa'

const Sidebar = () => {
    const location = useLocation()

    const menuItems = [
        { title: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
        { title: 'Usuarios', path: '/admin/usuarios', icon: FaUsers },
        { title: 'Financiamiento', path: '/admin/financiamiento', icon: FaMoneyBillWave },
        { title: 'Vehículos', path: '/admin/vehiculos', icon: FaCar },
        { title: 'Servicios', path: '/admin/servicios', icon: FaTools }
    ]

    return <aside className="dashboard-sidebar">
        <h5 className="text-white mb-3 px-3 pt-3">Admin Panel</h5>
        {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item text-light ${location.pathname === item.path && 'active'}`}
                    style={{ borderRadius: 8, textDecoration: 'none', color: 'inherit' }}
                >
                    <span>
                        <IconComponent className="me-2" /> {item.title}
                    </span>
                </Link>
            )
        })}
    </aside>
}

export default Sidebar
