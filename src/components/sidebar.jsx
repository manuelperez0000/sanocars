import { Link, useLocation } from 'react-router-dom'
import { FaTachometerAlt, FaUsers, FaMoneyBillWave, FaCar, FaTools, FaImages, FaSignOutAlt } from 'react-icons/fa'
import useLogin from '../hooks/useLogin'
import useServices from '../hooks/useServices'

const Sidebar = () => {
    const location = useLocation()
    const { logout } = useLogin()
    const { services } = useServices()

    const menuItems = [
        { title: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
        { title: 'Usuarios', path: '/admin/usuarios', icon: FaUsers },
        { title: 'Financiamiento', path: '/admin/financiamiento', icon: FaMoneyBillWave },
        { title: 'Vehículos', path: '/admin/vehiculos', icon: FaCar },
        { title: 'Servicios', path: '/admin/servicios', icon: FaTools },
        { title: 'Imagenes', path: '/admin/imagenes', icon: FaImages }
    ]

    return <aside className="dashboard-sidebar">
        <h5 className="text-white mb-3 px-3 pt-3">Admin Panel</h5>
        {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item text-light relative ${location.pathname === item.path && 'active'}`}
                    style={{ borderRadius: 8, textDecoration: 'none', color: 'inherit' }}
                >
                    <span>
                        <IconComponent className="me-2" /> {item.title}
                    </span>
                    {/* only show status=0 */}
                    {item.title === 'Servicios' && services.some(s => s.status === 0) && (
                        <span className="badge-2 bg-danger">
                            {services.filter(s => s.status === 0).length}
                        </span>
                    )}
                </Link>
            )
        })}
        <button
            onClick={logout}
            className="btn btn-primary mt-3 mx-3"
            style={{ width: 'calc(100% - 1.5rem)' }}
        >
            <FaSignOutAlt className="me-2" /> Cerrar Sesión
        </button>
    </aside>
}

export default Sidebar
