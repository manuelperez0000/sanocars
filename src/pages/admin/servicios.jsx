
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useServices from '../../hooks/useServices'

const Servicios = () => {
    const navigate = useNavigate()
    const { services, loading, error, saving, updateServiceStatus } = useServices()
    const [statusFilter, setStatusFilter] = useState('')

    const filteredServices = statusFilter === ''
        ? services
        : services.filter(service => service.status === parseInt(statusFilter))

    const handleStatusChange = async (serviceId, newStatus) => {
        try {
            await updateServiceStatus(serviceId, newStatus)
        } catch (error) {
            alert('Error al actualizar el estado: ' + error.message)
        }
    }

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Gestión de Servicios</h2>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/admin/categorias-servicio')}
                            >
                                Categorías
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Gestión de Servicios</h2>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/admin/categorias-servicio')}
                            >
                                Categorías
                            </button>
                        </div>
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Gestión de Servicios</h2>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/admin/categorias-servicio')}
                        >
                            Categorías
                        </button>
                    </div>



                    {/* Services Table */}
                    <div className="card">
                        <div className="card-body">
                            <div className='flex-between'>
                                <h5 className="card-title">Reservas de clientes ({filteredServices.length})</h5>
                                <select
                                    className="form-select w-50"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="0">Pendiente</option>
                                    <option value="1">Aprobado</option>
                                    <option value="2">Cancelado</option>
                                    <option value="3">Ejecutado</option>
                                </select>
                            </div>


                            {filteredServices.length === 0 ? (
                                <p>No hay servicios para mostrar.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>Servicio</th>
                                                <th>Fecha Reserva</th>

                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredServices.map((service) => (
                                                <tr key={service.id}>
                                                    <td>{service.nombre}</td>
                                                    <td>{service.email}</td>
                                                    <td>{service.telefono}</td>
                                                    <td>{service.servicio}</td>
                                                    <td>{new Date(service.fecha_reserva).toLocaleDateString()}</td>

                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name={`status-${service.id}`}
                                                                id={`pending-${service.id}`}
                                                                checked={service.status === 0}
                                                                onChange={() => handleStatusChange(service.id, 0)}
                                                                disabled={saving}
                                                            />
                                                            <label className="btn btn-outline-warning btn-sm" htmlFor={`pending-${service.id}`}>
                                                                Pendiente
                                                            </label>

                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name={`status-${service.id}`}
                                                                id={`approved-${service.id}`}
                                                                checked={service.status === 1}
                                                                onChange={() => handleStatusChange(service.id, 1)}
                                                                disabled={saving}
                                                            />
                                                            <label className="btn btn-outline-success btn-sm" htmlFor={`approved-${service.id}`}>
                                                                Aprobado
                                                            </label>

                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name={`status-${service.id}`}
                                                                id={`cancelled-${service.id}`}
                                                                checked={service.status === 2}
                                                                onChange={() => handleStatusChange(service.id, 2)}
                                                                disabled={saving}
                                                            />
                                                            <label className="btn btn-outline-danger btn-sm" htmlFor={`cancelled-${service.id}`}>
                                                                Cancelado
                                                            </label>

                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name={`status-${service.id}`}
                                                                id={`executed-${service.id}`}
                                                                checked={service.status === 3}
                                                                onChange={() => handleStatusChange(service.id, 3)}
                                                                disabled={saving}
                                                            />
                                                            <label className="btn btn-outline-info btn-sm" htmlFor={`executed-${service.id}`}>
                                                                Ejecutado
                                                            </label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Servicios
