import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    FaCar,
    FaKey,
    FaWarehouse,
    FaTools,
    FaMoneyBillWave,
    FaChartBar,
    FaTachometerAlt
} from 'react-icons/fa';
import useServices from '../../hooks/useServices';
import useDashboard from '../../hooks/useDashboard';
import Calendario from './calendario';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const Dashboard = () => {
    const { pendingServicesCount } = useServices()
    const { dashboardData, loading } = useDashboard()

    const chartData = {
        labels: ['Servicios', 'Ventas', 'Alquileres'],
        datasets: [
            {
                label: 'Ingresos ($)',
                data: [dashboardData.ingresos.servicios, dashboardData.ingresos.ventas, dashboardData.ingresos.alquileres],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ingresos por Categoría',
            },
        },
    };

    return (
        <div className='dark-bg m-0 p-3'>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="text-light fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        <FaTachometerAlt className="me-3" />
                        Dashboard Administrativo
                    </h3>
                    <div className="text-light">
                        <small>Última actualización: {new Date().toLocaleDateString('es-ES')}</small>
                    </div>
                </div>

                {/* Estadísticas de Vehículos */}
                <div className="row mb-3 g-3">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-lg h-100"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '15px',
                                transform: 'translateY(0)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body text-center text-white p-4">
                                <div className="mb-3">
                                    <FaCar size={60} />
                                </div>
                                <h5 className="card-title fw-bold mb-3">Vehículos Vendidos</h5>
                                <h1 className="fw-bold" style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {loading ? '...' : dashboardData.vehiculosVendidosMes}
                                </h1>
                                <div className="mt-3">
                                    <small className="opacity-75">Este mes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-lg h-100"
                            style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                borderRadius: '15px',
                                transform: 'translateY(0)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body text-center text-white p-4">
                                <div className="mb-3">
                                    <FaKey size={60} />
                                </div>
                                <h5 className="card-title fw-bold mb-3">Vehículos Alquilados</h5>
                                <h1 className="fw-bold" style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {loading ? '...' : dashboardData.vehiculosAlquilados}
                                </h1>
                                <div className="mt-3">
                                    <small className="opacity-75">Actualmente</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-lg h-100"
                            style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: '15px',
                                transform: 'translateY(0)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body text-center text-white p-4">
                                <div className="mb-3">
                                    <FaWarehouse size={60} />
                                </div>
                                <h5 className="card-title fw-bold mb-3">Total Vehículos</h5>
                                <h1 className="fw-bold" style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {loading ? '...' : dashboardData.totalVehiculos}
                                </h1>
                                <div className="mt-3">
                                    <small className="opacity-75">En inventario</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Servicios y Financiamientos Pendientes */}
                <div className="row mb-3 g-3">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-lg h-100"
                            style={{
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                borderRadius: '15px',
                                transform: 'translateY(0)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body text-center text-white p-4">
                                <div className="mb-3">
                                    <FaTools size={60} />
                                </div>
                                <h5 className="card-title fw-bold mb-3">Servicios Pendientes</h5>
                                <h1 className="fw-bold" style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {pendingServicesCount}
                                </h1>
                                <div className="mt-3">
                                    <small className="opacity-75">Requieren atención</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-0 shadow-lg h-100"
                            style={{
                                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                borderRadius: '15px',
                                transform: 'translateY(0)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body text-center text-dark p-4">
                                <div className="mb-3">
                                    <FaMoneyBillWave size={60} />
                                </div>
                                <h5 className="card-title fw-bold mb-3">Financiamientos Pendientes</h5>
                                <h1 className="fw-bold" style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(255,255,255,0.5)' }}>
                                    {loading ? '...' : dashboardData.financiamientosPendientes}
                                </h1>
                                <div className="mt-3">
                                    <small className="opacity-75">En proceso</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='m-auto'>
                    <Calendario />
                    </div>     
                    
                {/* Gráfico de Ingresos por Categoría */}
                {/* <div className="card border-0 shadow-lg"
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px'
                    }}>
                    <div className="card-header border-0 bg-transparent">
                        <h3 className="text-dark fw-bold mb-0">
                            <FaChartBar className="me-3" />
                            Ingresos por Categoría
                        </h3>
                        <small className="text-muted">Vista mensual de ingresos</small>
                    </div>
                    <div className="card-body p-4">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Dashboard
