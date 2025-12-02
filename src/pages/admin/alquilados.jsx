
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRentals from '../../hooks/useRentals'
import request from '../../utils/request'
import { apiurl } from '../../utils/globals'

const Alquilados = () => {
    const { rentals, loading, error } = useRentals()
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [selectedRental, setSelectedRental] = useState(null)
    const [paymentRecord, setPaymentRecord] = useState(null)
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
    const [loadingPayment, setLoadingPayment] = useState(false)
    const navigate = useNavigate()

    const openPaymentModal = async (rental) => {
        setSelectedRental(rental)
        setLoadingPayment(true)

        try {
            // Get payment record for this vehicle
            const response = await request.get(`${apiurl}/pagos-alquileres/vehiculo/${rental.vehiculo_id}`)
            setPaymentRecord(response.data.body)
        } catch (error) {
            void error
            // If no payment record exists, set to null
            setPaymentRecord(null)
        } finally {
            setLoadingPayment(false)
        }

        setPaymentModalOpen(true)
    }

    const closePaymentModal = () => {
        setPaymentModalOpen(false)
        setSelectedRental(null)
        setPaymentRecord(null)
        setPaymentDate(new Date().toISOString().split('T')[0])
    }

    const handleMakePayment = async () => {
        if (!selectedRental || !paymentDate) return

        setLoadingPayment(true)
        try {
            const currentPayments = paymentRecord?.pagos_realizados || []

            // Check if payment already exists for this date
            if (currentPayments.includes(paymentDate)) {
                alert('Ya existe un pago registrado para esta fecha. No se pueden registrar dos pagos el mismo día.')
                setLoadingPayment(false)
                return
            }

            const newPayments = [...currentPayments, paymentDate]

            // Calculate next payment date (30 days from rental start date)
            const rentalStartDate = new Date(selectedRental.fecha_inicio)
            const nextPaymentDate = new Date(rentalStartDate)
            nextPaymentDate.setDate(nextPaymentDate.getDate() + 30)

            const updateData = {
                pagos_realizados: newPayments,
                fecha_proximo_pago: nextPaymentDate.toISOString().split('T')[0]
            }

            if (paymentRecord) {
                // Update existing record
                await request.put(`${apiurl}/pagos-alquileres/${paymentRecord.id}`, updateData)
            } else {
                // Create new record
                await request.post(`${apiurl}/pagos-alquileres`, {
                    vehiculo_id: selectedRental.vehiculo_id,
                    ...updateData
                })
            }

            // Refresh payment record
            const response = await request.get(`${apiurl}/pagos-alquileres/vehiculo/${selectedRental.vehiculo_id}`)
            setPaymentRecord(response.data.body)

        } catch (error) {
            console.error('Error making payment:', error)
            alert('Error al procesar el pago')
        } finally {
            setLoadingPayment(false)
        }
    }

    const endRentalContract = async (rental) => {
        if (!confirm(`¿Está seguro de que desea finalizar el contrato de alquiler para el vehículo ${rental.marca} ${rental.modelo}? Esta acción no se puede deshacer.`)) {
            return
        }

        try {
            // Delete the rental record
            await request.delete(`${apiurl}/alquileres/${rental.id}`)

            // Change vehicle status back to "En alquiler" (available for rent)
            await request.put(`${apiurl}/vehicles/${rental.vehiculo_id}`, { status: 'En alquiler' })

            // Refresh the rentals list
            window.location.reload()

        } catch (error) {
            console.error('Error ending rental contract:', error)
            alert('Error al finalizar el contrato de alquiler')
        }
    }

    const printRentalInvoice = (rental) => {
        const printWindow = window.open('', '_blank')
        const invoiceHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura de Alquiler - ${rental.marca} ${rental.modelo}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.4;
                    }
                    .invoice-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .invoice-title {
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #2c3e50;
                    }
                    .invoice-subtitle {
                        font-size: 16px;
                        color: #7f8c8d;
                    }
                    .invoice-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .info-section {
                        flex: 1;
                    }
                    .info-section h4 {
                        margin: 0 0 10px 0;
                        color: #2c3e50;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .info-section p {
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .vehicle-details {
                        margin-bottom: 30px;
                    }
                    .vehicle-details h4 {
                        margin: 0 0 15px 0;
                        color: #2c3e50;
                        font-size: 16px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: repeat(5, 1fr);
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    .detail-item {
                        font-size: 14px;
                        line-height: 1.4;
                        padding: 5px 0;
                        padding: 5px;
                    }
                    .rental-info {
                        margin-bottom: 30px;
                    }
                    .rental-info h4 {
                        margin: 0 0 15px 0;
                        color: #2c3e50;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #7f8c8d;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                    <div class="invoice-title-section">
                        <h1 class="invoice-title" style="margin: 0; color: #2c3e50;">Factura de Alquiler</h1>
                        <p class="invoice-subtitle" style="margin: 5px 0; color: #7f8c8d;">Vehículo: ${rental.marca} ${rental.modelo}</p>
                    </div>
                    <div class="company-info" style="text-align: right;">
                        <h2 style="margin: 0; color: #2c3e50; font-size: 24px;">SANOCARS</h2>
                        <p style="margin: 5px 0; color: #7f8c8d;">Taller Automotriz</p>
                        <p style="margin: 5px 0; color: #7f8c8d;">Dirección: Calle Principal 123, Ciudad</p>
                        <p style="margin: 5px 0; color: #7f8c8d;">Teléfono: +58 414 122 0527</p>
                        <p style="margin: 5px 0; color: #7f8c8d;">Email: info@sanocars.com</p>
                    </div>
                </div>

                <div class="invoice-info">
                    <div class="info-section">
                        <h4>Información del Cliente</h4>
                        <p><strong>Nombre:</strong> ${rental.cliente_nombre || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> ${rental.cliente_telefono || 'N/A'}</p>
                        <p><strong>Email:</strong> ${rental.cliente_email || 'N/A'}</p>
                        <p><strong>Dirección:</strong> ${rental.cliente_direccion || 'N/A'}</p>
                    </div>
                    <div class="info-section">
                        <h4>Información del Vehículo</h4>
                        <p><strong>Marca:</strong> ${rental.marca || 'N/A'}</p>
                        <p><strong>Modelo:</strong> ${rental.modelo || 'N/A'}</p>
                        <p><strong>Año:</strong> ${rental.anio || 'N/A'}</p>
                        <p><strong>Placa:</strong> ${rental.numero_placa || 'N/A'}</p>
                        <p><strong>Color:</strong> ${rental.color || 'N/A'}</p>
                        <p><strong>ID Vehículo:</strong> ${rental.vehiculo_id}</p>
                    </div>
                    <div class="info-section">
                        <h4>Información del Alquiler</h4>
                        <p><strong>Fecha de Inicio:</strong> ${new Date(rental.fecha_inicio).toLocaleDateString('es-ES')}</p>
                        <p><strong>Precio Mensual:</strong> ¥${parseFloat(rental.precio_alquiler).toFixed(2)}</p>
                        <p><strong>Fecha del Alquiler:</strong> ${new Date(rental.fecha_alquiler).toLocaleDateString('es-ES')}</p>
                        <p><strong>ID Alquiler:</strong> ${rental.id}</p>
                    </div>
                </div>

                <div class="vehicle-details">
                    <h4>Detalles del Vehículo</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <strong>Kilometraje:</strong> ${rental.kilometraje || 'N/A'} km
                        </div>
                        <div class="detail-item">
                            <strong>Tipo:</strong> ${rental.tipo_vehiculo || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Tamaño Motor:</strong> ${rental.tamano_motor || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Número de Chasis:</strong> ${rental.numero_chasis || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Transmisión:</strong> ${rental.transmission || 'N/A'}
                        </div>
                    </div>
                </div>

                <div class="rental-info">
                    <h4>Información del Servicio de Alquiler</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <strong>Período de Alquiler:</strong> Mensual
                        </div>
                        <div class="detail-item">
                            <strong>Frecuencia de Pago:</strong> Mensual
                        </div>
                        <div class="detail-item">
                            <strong>Próximo Pago:</strong> ${new Date(new Date(rental.fecha_inicio).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
                        </div>
                        <div class="detail-item">
                            <strong>Estado del Vehículo:</strong> Alquilado
                        </div>
                        <div class="detail-item">
                            <strong>Observaciones:</strong> ${rental.observaciones || 'Sin observaciones'}
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Gracias por elegir nuestros servicios de alquiler. Alquiler realizado por Sanocars Taller.</p>
                    <p>Fecha de emisión: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
                </div>
            </body>
            </html>
        `

        printWindow.document.write(invoiceHTML)
        printWindow.document.close()

        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print()
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Vehículos en Alquiler</h2>
                        <div>
                            <button className="btn btn-secondary" onClick={() => navigate('/admin/vehiculos')}>Volver a Vehículos</button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="card">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4">Cargando alquileres...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                               
                                                <th>Vehículo</th>
                                                <th>Cliente</th>
                                                <th>Teléfono</th>
                                                <th>Precio Alquiler</th>
                                                <th>Fecha Alquiler</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rentals && rentals.length > 0 ? (
                                                rentals.map(rental => (
                                                    <tr key={rental.id}>
                                                        <td>
                                                            <div>
                                                                <strong>{rental.marca} {rental.modelo}</strong>
                                                                <br />
                                                                <small className="text-muted">
                                                                    Año: {rental.anio} | Placa: {rental.numero_placa}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>{rental.cliente_nombre}</td>
                                                        <td>{rental.cliente_telefono || '-'}</td>
                                                        {/* <td>{new Date(rental.fecha_inicio).toLocaleDateString('es-ES')}</td> */}
                                                        <td>¥{parseFloat(rental.precio_alquiler).toFixed(2)}</td>
                                                        <td>{new Date(rental.fecha_alquiler).toLocaleDateString('es-ES')}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-info me-1"
                                                                onClick={() => openPaymentModal(rental)}
                                                            >
                                                                Historial de Pagos
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-primary me-1"
                                                                onClick={() => printRentalInvoice(rental)}
                                                            >
                                                                Imprimir Factura
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => endRentalContract(rental)}
                                                            >
                                                                Finalizar Contrato
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={9} className="text-center p-4">No hay vehículos en alquiler</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1080 }}></div>
            )}
            {paymentModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1090 }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Historial de Pagos - {selectedRental?.marca} {selectedRental?.modelo}
                                </h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closePaymentModal}></button>
                            </div>
                            <div className="modal-body">
                                {loadingPayment ? (
                                    <div className="text-center p-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Vehicle and Client Info */}
                                        <div className="mb-4">
                                            <h6 className="text-primary mb-3">Información del Alquiler</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <strong>Cliente:</strong> {selectedRental?.cliente_nombre}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Precio Mensual:</strong> ¥{parseFloat(selectedRental?.precio_alquiler).toFixed(2)}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Fecha de Inicio:</strong> {new Date(selectedRental?.fecha_inicio).toLocaleDateString('es-ES')}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Próximo Pago:</strong> {paymentRecord?.fecha_proximo_pago ? new Date(paymentRecord.fecha_proximo_pago).toLocaleDateString('es-ES') : 'No establecido'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment History */}
                                        <div className="mb-4">
                                            <h6 className="text-primary mb-3">Historial de Pagos</h6>
                                            {paymentRecord?.pagos_realizados && paymentRecord.pagos_realizados.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Fecha de Pago</th>
                                                                <th>Monto</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paymentRecord?.pagos_realizados.map((fecha, index) => (
                                                                <tr key={index}>
                                                                    <td>{new Date(fecha).toLocaleDateString('es-ES')}</td>
                                                                    <td>¥{parseFloat(selectedRental?.precio_alquiler).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="alert alert-info">
                                                    <strong>No hay pagos registrados.</strong> Este es el primer alquiler de este vehículo.
                                                </div>
                                            )}
                                        </div>

                                        {/* Make Payment Section */}
                                        <div className="border-top pt-3">
                                            <h6 className="text-primary mb-3">Registrar Nuevo Pago</h6>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Fecha del Pago</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={paymentDate}
                                                        onChange={(e) => setPaymentDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Monto</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={`¥${parseFloat(selectedRental?.precio_alquiler).toFixed(2)}`}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-success"
                                                onClick={handleMakePayment}
                                                disabled={loadingPayment}
                                            >
                                                {loadingPayment ? 'Procesando...' : 'Registrar Pago'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closePaymentModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Alquilados
