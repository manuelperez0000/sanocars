import React, { useState } from 'react'
import useFacturas from '../../hooks/useFacturas'

const Facturas = () => {
    const { facturas, loading, error, deleteFactura } = useFacturas()
    const [selectedFactura, setSelectedFactura] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewFactura = (factura) => {
        setSelectedFactura(factura)
        setModalOpen(true)
    }

    const handleDeleteFactura = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta factura?')) return
        try {
            await deleteFactura(id)
        } catch (err) {
            alert('Error eliminando factura: ' + err.message)
        }
    }

    const getTipoLabel = (tipo) => {
        const tipos = {
            'venta': 'Venta de Vehículo',
            'alquiler': 'Alquiler de Vehículo',
            'producto': 'Producto',
            'servicio': 'Servicio'
        }
        return tipos[tipo] || tipo
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES'
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-VE')
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
                    <h2 className="mb-4">Facturas</h2>

                    {facturas.length === 0 ? (
                        <div className="alert alert-info">
                            No hay facturas registradas
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <h5>Lista de Facturas</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tipo</th>
                                                <th>Cliente</th>
                                                <th>Total</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {facturas.map(factura => (
                                                <tr key={factura.id}>
                                                    <td>{factura.id}</td>
                                                    <td>
                                                        <span className="badge bg-primary">
                                                            {getTipoLabel(factura.tipo)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {factura.cliente_nombre}
                                                        {factura.cliente_apellido && ` ${factura.cliente_apellido}`}
                                                    </td>
                                                    <td>{formatCurrency(factura.total)}</td>
                                                    <td>{formatDate(factura.fecha_creacion)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-info me-2"
                                                            onClick={() => handleViewFactura(factura)}
                                                        >
                                                            Ver
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteFactura(factura.id)}
                                                        >
                                                            Eliminar
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

            {/* Invoice Detail Modal */}
            {modalOpen && selectedFactura && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Factura #{selectedFactura.id} - {getTipoLabel(selectedFactura.tipo)}
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
                                                    <p><strong>Nombre:</strong> {selectedFactura.cliente_nombre}</p>
                                                    <p><strong>Apellido:</strong> {selectedFactura.cliente_apellido || 'N/A'}</p>
                                                    <p><strong>Género:</strong> {selectedFactura.cliente_genero || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Email:</strong> {selectedFactura.cliente_email || 'N/A'}</p>
                                                    <p><strong>Teléfono:</strong> {selectedFactura.cliente_telefono || 'N/A'}</p>
                                                    <p><strong>Cédula:</strong> {selectedFactura.cliente_cedula || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Items</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Descripción</th>
                                                            <th>Cantidad</th>
                                                            <th>Precio Unitario</th>
                                                            <th>Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedFactura.items && selectedFactura.items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.name}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{formatCurrency(item.price)}</td>
                                                                <td>{formatCurrency(item.subtotal)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                            <td className="fw-bold">{formatCurrency(selectedFactura.total)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    {selectedFactura.datos_pago && (
                                        <div className="card mb-3">
                                            <div className="card-header">
                                                <h6>Información de Pago</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Tipo de Pago:</strong> {selectedFactura.datos_pago.paymentType === 'contado' ? 'Pago de Contado' : 'Pago en Cuotas'}</p>
                                                        {selectedFactura.datos_pago.paymentType === 'cuotas' && (
                                                            <>
                                                                <p><strong>Número de Cuotas:</strong> {selectedFactura.datos_pago.installments}</p>
                                                                <p><strong>Frecuencia:</strong> {selectedFactura.datos_pago.frequency === 'mensuales' ? 'Mensuales' : selectedFactura.datos_pago.frequency === 'semanales' ? 'Semanales' : 'Quincenales'}</p>
                                                                <p><strong>Fecha de Inicio:</strong> {formatDate(selectedFactura.datos_pago.startDate)}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Installments */}
                                    {selectedFactura.cuotas && selectedFactura.cuotas.length > 0 && (
                                        <div className="card">
                                            <div className="card-header">
                                                <h6>Plan de Cuotas</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table className="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Número de Cuota</th>
                                                                <th>Monto</th>
                                                                <th>Fecha de Vencimiento</th>
                                                                <th>Estado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedFactura.cuotas.map(cuota => (
                                                                <tr key={cuota.number}>
                                                                    <td>{cuota.number}</td>
                                                                    <td>{formatCurrency(cuota.amount)}</td>
                                                                    <td>{cuota.dueDate}</td>
                                                                    <td>
                                                                        <span className={`badge ${cuota.status === 'Pagado' ? 'bg-success' : 'bg-warning'}`}>
                                                                            {cuota.status}
                                                                        </span>
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

export default Facturas
