import { Link, useLocation } from 'react-router-dom'
import { FaTachometerAlt, FaUsers, FaMoneyBillWave, FaCar, FaTools, FaImages, FaSignOutAlt, FaCog } from 'react-icons/fa'
import useLogin from '../hooks/useLogin'
import useServices from '../hooks/useServices'
const Sidebar = () => {
    const { pendingServicesCount } = useServices()
    const location = useLocation()
    const { logout } = useLogin()

    const menuItems = [
        { title: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
        { title: 'Facturacion', path: '/admin/facturacion', icon: FaTachometerAlt },
        { title: 'Vehículos', path: '/admin/vehiculos', icon: FaCar },
        { title: 'Servicios', path: '/admin/servicios', icon: FaTools },
        { title: 'Reservas', path: '/admin/reservas', icon: FaTools },
        { title: 'Financiamiento', path: '/admin/financiamiento', icon: FaMoneyBillWave },
        { title: 'Seguimiento', path: '/admin/seguimiento', icon: FaImages },
        { title: 'Inspeccion vehicular', path: '/admin/inspeccion-vehicular', icon: FaImages },
        { title: 'Informe de Vehículos', path: '/admin/informe-vehiculos', icon: FaImages },
        { title: 'Inventario', path: '/admin/inventario', icon: FaImages },
        { title: 'Usuarios', path: '/admin/usuarios', icon: FaUsers },
        { title: 'Imagenes', path: '/admin/imagenes', icon: FaImages },
        { title: 'Configuracion', path: '/admin/configuracion', icon: FaCog }
    ]

    return <aside className="dashboard-sidebar">
        <h5 className="text-white mb-3 px-3 pt-3">Admin Panel</h5>
        <hr className='text-light' />
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
                    {item.title === 'Reservas' && pendingServicesCount > 0 && (
                        <span className="badge-2">
                            {pendingServicesCount}
                        </span>
                    )}
                </Link>
            )
        })}
        <button
            onClick={logout}
            className="btn btn-primary mt-5 mx-auto d-block"
            style={{ width: 'calc(100% - 1.5rem)' }}
        >
            <FaSignOutAlt className="me-2" /> Cerrar Sesión
        </button>
    </aside>
}

export default Sidebar
