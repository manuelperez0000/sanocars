
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useInformeVehiculos from '../../hooks/useInformeVehiculos'
import { topurl } from '../../utils/globals'
import carrito from '../../assets/carrito.png'
import { headerFactura } from '../../assets/facturaTemplate'
const InformeVehiculos = () => {
    const navigate = useNavigate()
    const { informes, loading, error, deleteInforme,loadCar } = useInformeVehiculos()
    const [selectedInforme, setSelectedInforme] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewInforme = (informe) => {
        setSelectedInforme(informe)
        setModalOpen(true)
    }

    const handleDeleteInforme = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este informe de vehículo?')) return
        try {
            await deleteInforme(id)
        } catch (err) {
            alert('Error eliminando informe: ' + err?.response?.data?.message)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-VE')
    }

    const printReport = (reportData) => {
        const printWindow = window.open('', '_blank')
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('es-VE')
        }

        const getStatusBadge = (status) => {
            const colors = {
                'Buen estado': '#ffffffff',
                'Requiere atención': '#fffefaff',
                'Malo': '#ffffffff'
            }
            return colors[status] || '#ffffffff'
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Informe de Inspección de Vehículo #${reportData.id}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Arial', sans-serif;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #333;
                        background: #fff;
                    }

                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        background: #fff;
                    }

                    .invoice-header {
                        display: flex;
                        justify-content: space-between;
                        width:100vw;
                    }

                    .company-info {
                        display: flex;
                        align-items: center;
                        gap: 0px;
                    }

                    .company-logo {
                        width: 60px;
                        height: 60px;
                        object-fit: contain;
                    }

                    .company-name {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        text-transform: uppercase;
                    }

                    .document-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #666;
                        text-align: right;
                    }

                    .date-section {
                        text-align: right;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }

                    .date-section strong {
                        color: #333;
                    }

                    .section {
                        margin-bottom: 5px;
                    }

                    .section-header {
                        background: #f8f9fa;
                        padding: 10px 15px;
                        font-weight: bold;
                        font-size: 14px;
                        color: #333;
                    }

                    .section-content {
                        padding: 0px 10px;
                    }

                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0px;
                        margin-bottom: 5px;
                    }
                    .info-grid-2 {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 0px;
                        margin-bottom: 5px;
                    }

                    .info-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 5px 5px;
                        border:1px solid black;
                        justify-content: start;
                    }
                    .info-item-2{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 5px 5px;
                        border:1px solid black;
                        justify-content: start;
                        height:260px;
                    }
                        .company-info-section {
                            display: flex;
                            height: 260px;
                            justify-content: center;
                            align-items: center;
                            text-align: center;
                        }

                        .company-info-header {
                            font-weight: bold;
                            font-size: 14px;
                            color: #000000ff;
                            text-transform: uppercase;
                            margin-bottom: 10px;
                            width: 100%;
                            text-align: center;
                        }

                        .company-info-content h3 {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: #333;
                        }

                        .company-info-content p {
                            margin: 5px 0;
                            font-size: 12px;
                            line-height: 1.4;
                        }

                    .info-label {
                        font-weight: bold;
                        font-size: 11px;
                        color: #000000ff;
                        text-transform: uppercase;
                        margin-bottom: 3px;
                        width: 100%;
                        text-align: center;
                    }

                    .info-value {
                        font-size: 13px;
                        color: #000000ff;
                        padding: 5px 0;
                    }

                    .status-badge {
                        display: inline-block;
                        padding: 3px 8px;
                        border-radius: 12px;
                        color: black;
                        font-size: 10px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }

                    .full-width {
                        grid-column: 1 / -1;
                    }

                    .text-area {
                        padding: 10px;
                        border-radius: 4px;
                        min-height: 60px;
                        font-size: 12px;
                        line-height: 1.4;
                    }

                    .vehicle-grid {
                        display: grid;
                        grid-template-columns: repeat(7, 1fr);
                        gap: 0px;
                    }

                    .condition-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 0px;
                    }

                    .footer {
                        margin-top: 10px;
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        border-top: 1px solid #e0e0e0;
                        padding-top: 15px;
                    }
                    .flex-between{
                        display:flex;
                        justify-content:space-between;
                        width:100%;
                        padding:15px;
                    }

                    @media print {
                        body {
                            font-size: 11px;
                        }
                        .invoice-container {
                            border: none;
                            padding: 0;
                            max-width: none;
                        }
                        .section {
                            page-break-inside: avoid;
                        }
                    }

                    @page {
                        margin: 0.5in;
                        size: A4;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <!-- Invoice Header -->
                    ${headerFactura({id:reportData.id,titulo:"Informe de Inspección de Vehículos"})}
                    <!-- Client Information -->
                    <div class="">
                        <div class="section-header">Información del Cliente</div>
                        <div class="section-content">
                            <div class="info-grid-2">
                                <div class="info-item">
                                    <div class="info-label">Nombre</div>
                                    <div class="info-value">${reportData.cliente_nombre}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Teléfono</div>
                                    <div class="info-value">${reportData.cliente_telefono || 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Email</div>
                                    <div class="info-value">${reportData.cliente_email || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicle Information -->
                    <div class="section">
                        <div class="section-header">Información del Vehículo</div>
                        <div class="section-content">
                            <div class="vehicle-grid">
                                <div class="info-item">
                                    <div class="info-label">Marca</div>
                                    <div class="info-value">${reportData.vehiculo_marca}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Modelo</div>
                                    <div class="info-value">${reportData.vehiculo_modelo}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Año</div>
                                    <div class="info-value">${reportData.vehiculo_anio}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Color</div>
                                    <div class="info-value">${reportData.vehiculo_color}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Motor</div>
                                    <div class="info-value">${reportData.vehiculo_motor || 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Kilometraje</div>
                                    <div class="info-value">${reportData.vehiculo_kilometraje || 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Fecha Shaken</div>
                                    <div class="info-value">${reportData.vehiculo_fecha_shaken ? formatDate(reportData.vehiculo_fecha_shaken) : 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicle Condition -->
                    <div class="section">
                        <div class="section-header">Estado del Vehículo</div>
                        <div class="section-content">
                            <div class="condition-grid">
                                <div class="info-item">
                                    <div class="info-label">Estado de la Batería</div>
                                    <div class="info-value">
                                        <span class="status-badge" style="background-color: ${getStatusBadge(reportData.vehiculo_estado_bateria)}">${reportData.vehiculo_estado_bateria}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Estado del Aceite</div>
                                    <div class="info-value">
                                        <span class="status-badge" style="background-color: ${getStatusBadge(reportData.vehiculo_estado_aceite)}">${reportData.vehiculo_estado_aceite}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Estado Líquido de Frenos</div>
                                    <div class="info-value">
                                        <span class="status-badge" style="background-color: ${getStatusBadge(reportData.vehiculo_estado_liquido_frenos)}">${reportData.vehiculo_estado_liquido_frenos}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Estado Líquido Refrigerante</div>
                                    <div class="info-value">
                                        <span class="status-badge" style="background-color: ${getStatusBadge(reportData.vehiculo_estado_liquido_refrigerante)}">${reportData.vehiculo_estado_liquido_refrigerante}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Porcentaje Pastillas de Freno</div>
                                    <div class="info-value">${reportData.vehiculo_porcentaje_pastillas_freno}%</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Porcentaje Neumáticos</div>
                                    <div class="info-value">${reportData.vehiculo_porcentaje_neumaticos}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-header">Información Adicional</div>
                        <div class="section-content">
                            <div class="info-grid">
                                <div class="info-item" style="height:200px">
                                    <div class="info-label">Observaciones</div>
                                    <div class="text-area">${reportData.vehiculo_observacion_general || 'N/A'}</div>
                                </div>
                                <div class="info-item" style="height:200px">
                                    <div class="info-label">Trabajos de Pintura</div>
                                    <div class="text-area">${reportData.vehiculo_trabajos_realizar || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div class="info-grid" style="grid-template-columns: repeat(2, 1fr);">
                            <div class="company-info-section">
                                <img src="${carrito}" height="220px" />
                            </div>
                            <div class="info-item">
                                <div class="info-label">Detalles de Pintura</div>
                                <div class="text-area">${reportData.vehiculo_detalles_pintura || 'N/A'}</div>
                            </div>
                        </div>
                </div>
            </body>
            </html>
        `)

        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
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
                        <h2>Informes de Vehículos</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/admin/informe-vehiculos/nuevo')}
                        >
                            Nuevo Informe
                        </button>
                    </div>

                    {informes.length === 0 ? (
                        <div className="alert alert-info">
                            No hay informes de vehículos registrados
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <h5>Lista de Informes</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Fecha Ingreso</th>
                                                <th>Cliente</th>
                                                <th>Vehículo</th>
                                                <th>Estado Batería</th>
                                                <th>Estado Aceite</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {informes.map(informe => (
                                                <tr key={informe.id}>
                                                    <td>{informe.id}</td>
                                                    <td>{formatDate(informe.fecha_ingreso)}</td>
                                                    <td>{informe.cliente_nombre}</td>
                                                    <td>{informe.vehiculo_marca} {informe.vehiculo_modelo} {informe.vehiculo_anio}</td>
                                                    <td>
                                                        <span className={`badge ${informe.vehiculo_estado_bateria === 'Buen estado' ? 'bg-success' : informe.vehiculo_estado_bateria === 'Requiere atención' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {informe.vehiculo_estado_bateria}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${informe.vehiculo_estado_aceite === 'Buen estado' ? 'bg-success' : informe.vehiculo_estado_aceite === 'Requiere atención' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {informe.vehiculo_estado_aceite}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-info me-2"
                                                            onClick={() => handleViewInforme(informe)}
                                                        >
                                                            Ver
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-warning me-2"
                                                            onClick={() => navigate(`/admin/informe-vehiculos/editar/${informe.id}`)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-primary me-2"
                                                            onClick={() => printReport(informe)}
                                                            disabled={!loadCar}
                                                        ><span class="sr-only" role="status" aria-hidden="true">Imprimir </span>
                                                            {!loadCar && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteInforme(informe.id)}
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

            {/* Report Detail Modal */}
            {modalOpen && selectedInforme && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Informe de Vehículo #{selectedInforme.id}
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
                                                    <p><strong>Nombre:</strong> {selectedInforme.cliente_nombre}</p>
                                                    <p><strong>Teléfono:</strong> {selectedInforme.cliente_telefono || 'N/A'}</p>
                                                    <p><strong>Email:</strong> {selectedInforme.cliente_email || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Fecha de Ingreso:</strong> {formatDate(selectedInforme.fecha_ingreso)}</p>
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
                                                    <p><strong>Marca:</strong> {selectedInforme.vehiculo_marca}</p>
                                                    <p><strong>Modelo:</strong> {selectedInforme.vehiculo_modelo}</p>
                                                    <p><strong>Año:</strong> {selectedInforme.vehiculo_anio}</p>
                                                    <p><strong>Color:</strong> {selectedInforme.vehiculo_color}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Motor:</strong> {selectedInforme.vehiculo_motor || 'N/A'}</p>
                                                    <p><strong>Kilometraje:</strong> {selectedInforme.vehiculo_kilometraje || 'N/A'}</p>
                                                    <p><strong>Fecha Shaken:</strong> {selectedInforme.vehiculo_fecha_shaken ? formatDate(selectedInforme.vehiculo_fecha_shaken) : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Condition */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Estado del Vehículo</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>Estado de la Batería:</strong>
                                                        <span className={`badge ms-2 ${selectedInforme.vehiculo_estado_bateria === 'Buen estado' ? 'bg-success' : selectedInforme.vehiculo_estado_bateria === 'Requiere atención' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {selectedInforme.vehiculo_estado_bateria}
                                                        </span>
                                                    </p>
                                                    <p><strong>Estado del Aceite:</strong>
                                                        <span className={`badge ms-2 ${selectedInforme.vehiculo_estado_aceite === 'Buen estado' ? 'bg-success' : selectedInforme.vehiculo_estado_aceite === 'Requiere atención' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {selectedInforme.vehiculo_estado_aceite}
                                                        </span>
                                                    </p>
                                                    <p><strong>Estado Líquido de Frenos:</strong>
                                                        <span className={`badge ms-2 ${selectedInforme.vehiculo_estado_liquido_frenos === 'Buen estado' ? 'bg-success' : selectedInforme.vehiculo_estado_liquido_frenos === 'Requiere atención' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {selectedInforme.vehiculo_estado_liquido_frenos}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Porcentaje Pastillas de Freno:</strong> {selectedInforme.vehiculo_porcentaje_pastillas_freno}%</p>
                                                    <p><strong>Porcentaje Neumáticos:</strong> {selectedInforme.vehiculo_porcentaje_neumaticos}%</p>
                                                    <p><strong>Estado Líquido Refrigerante:</strong>
                                                        <span className={`badge ms-2 ${selectedInforme.vehiculo_estado_liquido_refrigerante === 'Buen estado' ? 'bg-success' : selectedInforme.vehiculo_estado_liquido_refrigerante === 'Requiere atención' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {selectedInforme.vehiculo_estado_liquido_refrigerante}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h6>Información Adicional</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>Observaciones:</strong></p>
                                                    <p>{selectedInforme.vehiculo_observacion_general || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Trabajos de Pintura:</strong></p>
                                                    <p>{selectedInforme.vehiculo_trabajos_realizar || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    {selectedInforme.vehiculo_imagen && (
                                                        <img
                                                            src={`${topurl}/uploads/${selectedInforme.vehiculo_imagen}`}
                                                            alt="Vehículo"
                                                            className="img-fluid"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Detalles de Pintura:</strong></p>
                                                    <p>{selectedInforme.vehiculo_detalles_pintura || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Images */}
                                    {selectedInforme.vehiculo_foto_documentos && (
                                        <div className="card">
                                            <div className="card-header">
                                                <h6>Imágenes</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Foto de Documentos:</strong></p>
                                                        <img
                                                            src={`${topurl}/uploads/${selectedInforme.vehiculo_foto_documentos}`}
                                                            alt="Documentos"
                                                            className="img-fluid"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
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

export default InformeVehiculos
