import { useState } from 'react'
import useVentas from '../../hooks/useVentas'
import { FaEye, FaTrash } from 'react-icons/fa'
import { formatCurrency, topurl, apiurl } from '../../utils/globals'
import useVehicles from '../../hooks/useVehicles'
import request from '../../utils/request'

const Vendidos = () => {
    const { getArrayImages, printSaleInvoice } = useVehicles()
    const { ventas, loading, error, deleteVenta } = useVentas()
    const [selectedVenta, setSelectedVenta] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingWarranty, setEditingWarranty] = useState(false)
    const [warrantyText, setWarrantyText] = useState('')

    const handleViewDetails = (venta) => {
        setSelectedVenta(venta)
        setModalOpen(true)
        setEditingWarranty(false)
        setWarrantyText(venta.informacion_garantia || '')
    }

    const handleEditWarranty = () => {
        setEditingWarranty(true)
        setWarrantyText(selectedVenta.informacion_garantia || '')
    }

    const handleSaveWarranty = async () => {
        try {
            // Hacer la llamada al backend usando el endpoint PUT existente
            const response = await request.put(`${apiurl}/venta/${selectedVenta.id}`, {
                informacion_garantia: warrantyText
            })

            console.log('Response from warranty update:', response)
            
            // El backend usa responser.success que devuelve directamente los datos
            if (response.data || response.message) {
                // Actualizar el estado local con la nueva información
                setSelectedVenta(prev => ({
                    ...prev,
                    informacion_garantia: warrantyText
                }))
                setEditingWarranty(false)
                alert('Garantía actualizada exitosamente')
            } else {
                throw new Error('Error al actualizar la garantía')
            }
        } catch (error) {
            console.error('Error updating warranty:', error)
            alert('Error al actualizar la garantía: ' + (error?.response?.data?.message || error.message))
        }
    }

    const handleCancelEditWarranty = () => {
        setEditingWarranty(false)
        setWarrantyText(selectedVenta.informacion_garantia || '')
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
            const result = await deleteVenta(id)
            if (!result.success) {
                alert('Error al eliminar la venta: ' + result.error)
            }
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('es-VE')
    }

    // Handle print sale details
    const handlePrint = (venta) => {
        // Create vehicle object from sale data
        const vehicle = {
            id: venta.vehiculo_id,
            marca: venta.vehiculo_marca,
            modelo: venta.vehiculo_modelo,
            anio: venta.vehiculo_anio,
            color: venta.vehiculo_color,
            numero_placa: venta.vehiculo_placa,
            kilometraje: venta.vehiculo_kilometraje,
            tipo_vehiculo: venta.vehiculo_tipo,
            tamano_motor: venta.vehiculo_tamano_motor,
            numero_chasis: venta.vehiculo_numero_chasis,
            observaciones: venta.vehiculo_observaciones,
            imagen1: venta.vehiculo_imagen1
        }

        // Call the printSaleInvoice function with sale data and vehicle
        printSaleInvoice(venta, vehicle)
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
                        <h2>Vehículos Vendidos</h2>
                        <div className="d-flex gap-2">
                            <span className="badge bg-success">Total: {ventas.length}</span>
                        </div>
                    </div>

                    {ventas.length === 0 ? (
                        <div className="alert alert-info">
                            No hay ventas registradas
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <h5>Lista de Ventas</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Cliente</th>
                                                <th>Tipo</th>
                                                <th>Precio Venta</th>
                                                <th>Tipo Pago</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ventas.map(venta => (
                                                <tr key={venta.id}>
                                                    <td>{venta.id}</td>
                                                    <td>
                                                        {venta.cliente_nombre} {venta.cliente_apellido}
                                                        {venta.cliente_email && (
                                                            <div className="small text-muted">{venta.cliente_email}</div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${venta.tipo === 'vehiculo' ? 'bg-primary' : 'bg-secondary'}`}>
                                                            {venta.tipo === 'vehiculo' ? 'Vehículo' : 'Producto'}
                                                        </span>
                                                    </td>
                                                    <td>{formatCurrency(venta.precio_venta)}</td>
                                                    <td>
                                                        <span className={`badge ${venta.tipo_pago === 'contado' ? 'bg-success' : venta.tipo_pago === 'cuotas' ? 'bg-warning' : 'bg-info'}`}>
                                                            {venta.tipo_pago === 'financiamiento japones' ? 'Financiamiento' : venta.tipo_pago}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(venta.fecha_inicial)}</td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleViewDetails(venta)}
                                                                title="Ver detalles"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() => handlePrint(venta)}
                                                                title="Imprimir"
                                                            >
                                                                🖨️
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(venta.id)}
                                                                title="Eliminar venta"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
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
            {modalOpen && selectedVenta && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Detalles de la Venta - {selectedVenta.cliente_nombre} {selectedVenta.cliente_apellido}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Sale Information */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Información de la Venta</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>ID:</strong> {selectedVenta.id}</p>
                                                    <p><strong>Tipo:</strong> {selectedVenta.tipo === 'vehiculo' ? 'Vehículo' : 'Producto'}</p>
                                                    <p><strong>Precio Venta:</strong> {formatCurrency(selectedVenta.precio_venta)}</p>
                                                    <p><strong>Tipo Pago:</strong> {selectedVenta.tipo_pago}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Fecha Inicial:</strong> {formatDate(selectedVenta.fecha_inicial)}</p>
                                                    {selectedVenta.numero_cuotas && (
                                                        <p><strong>Número de Cuotas:</strong> {selectedVenta.numero_cuotas}</p>
                                                    )}
                                                    {selectedVenta.frecuencia_cuotas && (
                                                        <p><strong>Frecuencia:</strong> {selectedVenta.frecuencia_cuotas}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client Information */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Información del Cliente</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>Nombre:</strong> {selectedVenta.cliente_nombre}</p>
                                                    <p><strong>Apellido:</strong> {selectedVenta.cliente_apellido || 'N/A'}</p>
                                                    <p><strong>Email:</strong> {selectedVenta.cliente_email || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Teléfono:</strong> {selectedVenta.cliente_telefono || 'N/A'}</p>
                                                    <p><strong>Dirección:</strong> {selectedVenta.cliente_direccion || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Information */}
                                    {selectedVenta.vehiculo_id && (
                                        <div className="card mb-3">
                                            <div className="card-header">
                                                <h6>Información del Vehículo</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Marca:</strong> {selectedVenta.vehiculo_marca || 'N/A'}</p>
                                                        <p><strong>Modelo:</strong> {selectedVenta.vehiculo_modelo || 'N/A'}</p>
                                                        <p><strong>Año:</strong> {selectedVenta.vehiculo_anio || 'N/A'}</p>
                                                        <p><strong>Color:</strong> {selectedVenta.vehiculo_color || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Placa:</strong> {selectedVenta.vehiculo_placa || 'N/A'}</p>
                                                        <p><strong>ID Vehículo:</strong> {selectedVenta.vehiculo_id}</p>
                                                        <p><strong>Kilometraje:</strong> {selectedVenta.vehiculo_kilometraje || 'N/A'}</p>
                                                        <p><strong>Fecha Cambio de Aceite:</strong> {formatDate(selectedVenta.vehiculo_cambio_aceite)}</p>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-12 col-md-6 mb-3">
                                                                <div className="card h-100">
                                                                    <div className="card-body">
                                                                        <h6 className="card-title">Trabajos a Realizar</h6>
                                                                        <p className="card-text mb-0">{selectedVenta.vehiculo_trabajos_realizar || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 mb-3">
                                                                <div className="card h-100">
                                                                    <div className="card-body">
                                                                        <h6 className="card-title">Mantenimiento General</h6>
                                                                        <p className="card-text mb-0">{selectedVenta.vehiculo_mantenimiento_general || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Vehicle Images */}
                                                {selectedVenta.vehiculo_imagen1 && (
                                                    <div className="mt-3">
                                                        <h6>Imágenes del Vehículo:</h6>
                                                        <div className="row">

                                                            {getArrayImages(selectedVenta.vehiculo_imagen1).map((image, index) => {
                                                                return <div className='col-4'>
                                                                    <img
                                                                        src={`${topurl}/uploads/${image}`}
                                                                        alt={`Imagen ${index + 1} del vehículo`}
                                                                        className="img-fluid rounded"
                                                                        style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'cover' }}
                                                                    /></div>
                                                            })
                                                            }

                                                        </div>
                                                    </div >
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Information */}
                                    {selectedVenta.tipo_pago === 'cuotas' && (
                                        <div className="card mb-3">
                                            <div className="card-header">
                                                <h6>Información de Pago</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Monto Inicial:</strong> {formatCurrency(selectedVenta.monto_inicial)}</p>
                                                        <p><strong>Tasa Interés:</strong> {selectedVenta.tasa_interes}%</p>
                                                        <p><strong>Número de Cuotas:</strong> {selectedVenta.numero_cuotas}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Frecuencia de Cuotas:</strong> {selectedVenta.frecuencia_cuotas}</p>
                                                        <p><strong>Total con Intereses:</strong> {formatCurrency(selectedVenta.total_con_intereses)}</p>
                                                    </div>
                                                </div>
                                                {/* Additional Payment Data */}
                                                {selectedVenta.datos_pago && (
                                                    <div className="mt-3">
                                                        <h6>Datos Adicionales de Pago:</h6>
                                                        {(() => {
                                                            try {
                                                                const datosPago = JSON.parse(selectedVenta.datos_pago);
                                                                return (
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <p><strong>Tipo de Pago:</strong> {datosPago.tipo_pago || 'N/A'}</p>
                                                                            <p><strong>Número de Cuotas:</strong> {datosPago.numero_cuotas || 'N/A'}</p>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <p><strong>Frecuencia:</strong> {datosPago.frecuencia_cuotas || 'N/A'}</p>
                                                                            <p><strong>Monto Inicial:</strong> {datosPago.monto_inicial ? formatCurrency(datosPago.monto_inicial) : 'N/A'}</p>
                                                                            <p><strong>Tasa de Interés:</strong> {datosPago.tasa_interes ? `${datosPago.tasa_interes}%` : 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            } catch {
                                                                return <p className="text-muted">Datos de pago no disponibles</p>;
                                                            }
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Warranty Information */}
                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6>Información de Garantía</h6>
                                            {!editingWarranty && (
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={handleEditWarranty}
                                                >
                                                    Editar
                                                </button>
                                            )}
                                        </div>
                                        <div className="card-body">
                                            {editingWarranty ? (
                                                <div>
                                                    <textarea
                                                        className="form-control mb-3"
                                                        rows="4"
                                                        value={warrantyText}
                                                        onChange={(e) => setWarrantyText(e.target.value)}
                                                        placeholder="Ingrese la información de garantía..."
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-primary" 
                                                            onClick={handleSaveWarranty}
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-secondary" 
                                                            onClick={handleCancelEditWarranty}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>{selectedVenta.informacion_garantia || 'No hay información de garantía disponible'}</p>
                                            )}
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

export default Vendidos
