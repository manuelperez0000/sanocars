import { useState, useMemo } from 'react'
import useClientes from '../../hooks/useClientes'
import { topurl } from '../../utils/globals'
import useVehicles from '../../hooks/useVehicles'
const Clientes = () => {
    const { clientes, loading, error } = useClientes()
    const [selectedCliente, setSelectedCliente] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [originFilter, setOriginFilter] = useState('')

    const handleViewDetails = (cliente) => {
        setSelectedCliente(cliente)
        setModalOpen(true)
    }

    const { getArrayImages } = useVehicles()

    const getTablaLabel = (tabla) => {
        const labels = {
            'venta': 'Venta',
            'alquileres': 'Alquiler',
            'inspeccion_vehicular': 'Inspección',
            'financiamiento': 'Financiamiento',
            'servicios': 'Servicio'
        }
        return labels[tabla] || tabla
    }

    const getBadgeColor = (tabla) => {
        const colors = {
            'venta': 'bg-success',
            'alquileres': 'bg-primary',
            'inspeccion_vehicular': 'bg-warning',
            'financiamiento': 'bg-info',
            'servicios': 'bg-secondary'
        }
        return colors[tabla] || 'bg-secondary'
    }

    // Filter and search logic
    const filteredClientes = useMemo(() => {
        return clientes.filter(cliente => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.telefono.includes(searchTerm)

            // Origin filter
            const matchesOrigin = originFilter === '' || cliente.tabla_origen === originFilter

            return matchesSearch && matchesOrigin
        })
    }, [clientes, searchTerm, originFilter])

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger">
                    Error: {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Clientes</h2>
                        <div className="d-flex gap-2">
                            <span className="badge bg-success">Venta</span>
                            <span className="badge bg-primary">Alquiler</span>
                            <span className="badge bg-warning">Inspección</span>
                            <span className="badge bg-info">Financiamiento</span>
                            <span className="badge bg-secondary">Servicio</span>
                        </div>
                    </div>

                    {clientes.length === 0 ? (
                        <div className="alert alert-info">
                            No hay clientes registrados
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Lista de Clientes ({filteredClientes.length} de {clientes.length})</h5>
                                    <div className="d-flex gap-3">
                                        <div className="input-group" style={{ width: '300px' }}>
                                            <span className="input-group-text">
                                                <i className="fas fa-search"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar por nombre, email o teléfono..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="form-select"
                                            style={{ width: '200px' }}
                                            value={originFilter}
                                            onChange={(e) => setOriginFilter(e.target.value)}
                                        >
                                            <option value="">Todos los orígenes</option>
                                            <option value="venta">Venta</option>
                                            <option value="alquileres">Alquiler</option>
                                            <option value="inspeccion_vehicular">Inspección</option>
                                            <option value="financiamiento">Financiamiento</option>
                                            <option value="servicios">Servicio</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>Vehículo</th>
                                                <th>Origen</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredClientes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        <div className="text-muted">
                                                            <i className="fas fa-search me-2"></i>
                                                            No se encontraron clientes que coincidan con los filtros aplicados
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredClientes.map(cliente => (
                                                    <tr key={cliente.id}>
                                                        <td>{cliente.nombre}</td>
                                                        <td>{cliente.email || 'N/A'}</td>
                                                        <td>{cliente.telefono || 'N/A'}</td>
                                                        <td>
                                                            {cliente.vehiculo_marca && cliente.vehiculo_modelo ?
                                                                `${cliente.vehiculo_marca} ${cliente.vehiculo_modelo} ${cliente.vehiculo_anio} ${cliente.vehiculo_color}` :
                                                                'N/A'
                                                            }
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getBadgeColor(cliente.tabla_origen)}`}>
                                                                {getTablaLabel(cliente.tabla_origen)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleViewDetails(cliente)}
                                                            >
                                                                Ver Detalles
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {modalOpen && selectedCliente && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Detalles del Cliente - {selectedCliente.nombre} {selectedCliente.apellido}
                                        <span className={`badge ${getBadgeColor(selectedCliente.tabla_origen)} ms-2`}>
                                            {getTablaLabel(selectedCliente.tabla_origen)}
                                        </span>
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Client Information */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Información del Cliente</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
                                                    <p><strong>Apellido:</strong> {selectedCliente.apellido || 'N/A'}</p>
                                                    <p><strong>Email:</strong> {selectedCliente.email || 'N/A'}</p>
                                                    <p><strong>Teléfono:</strong> {selectedCliente.telefono || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>ID en tabla:</strong> {selectedCliente.id}</p>
                                                    <p><strong>Tabla origen:</strong> {getTablaLabel(selectedCliente.tabla_origen)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Information */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Información del Vehículo</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>Marca:</strong> {selectedCliente.vehiculo_marca || 'N/A'}</p>
                                                    <p><strong>Modelo:</strong> {selectedCliente.vehiculo_modelo || 'N/A'}</p>
                                                    <p><strong>Año:</strong> {selectedCliente.vehiculo_anio || 'N/A'}</p>
                                                    <p><strong>Color:</strong> {selectedCliente.vehiculo_color || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Placa:</strong> {selectedCliente.vehiculo_placa || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Imagenes */}
                                    <div className="card">
                                        <div className="card-header">
                                            <h6>Imágenes del Vehículo</h6>
                                        </div>
                                        {console.log(selectedCliente.vehiculo_imagenes)}
                                        <div className="card-body">
                                            {selectedCliente.vehiculo_imagenes && selectedCliente.vehiculo_imagenes.length > 0 ? (
                                                <div className="row">
                                                    {getArrayImages(selectedCliente.vehiculo_imagenes).map((imagen, index) => (
                                                        <div key={index} className="col-md-6 mb-3">
                                                            <img
                                                                src={`${topurl}/uploads/${imagen}`}
                                                                alt={`Imagen ${index + 1} del vehículo`}
                                                                className="img-fluid rounded"
                                                                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted">No hay imágenes disponibles para este vehículo</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Clientes
