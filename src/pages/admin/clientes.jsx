import { useState } from 'react'
import useClientes from '../../hooks/useClientes'

const Clientes = () => {
    const { clientes, loading, error } = useClientes()
    const [selectedCliente, setSelectedCliente] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewDetails = (cliente) => {
        setSelectedCliente(cliente)
        setModalOpen(true)
    }

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
                                <h5>Lista de Clientes ({clientes.length})</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Apellido</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>Vehículo</th>
                                                <th>Origen</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientes.map(cliente => (
                                                <tr key={cliente.id}>
                                                    <td>{cliente.nombre}</td>
                                                    <td>{cliente.apellido}</td>
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
                                            ))}
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
                                                    <p><strong>ID en tabla:</strong> {selectedCliente.datos_completos.id}</p>
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

                                    {/* Complete Data */}
                                    <div className="card">
                                        <div className="card-header">
                                            <h6>Datos Completos ({getTablaLabel(selectedCliente.tabla_origen)})</h6>
                                        </div>
                                        <div className="card-body">
                                            <pre className="bg-light p-3 rounded" style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
                                                {JSON.stringify(selectedCliente.datos_completos, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                                        Cerrar
                                    </button>
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
