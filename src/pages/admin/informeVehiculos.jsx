
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useInformeVehiculos from '../../hooks/useInformeVehiculos'
import { hostUrl } from '../../utils/globals'

const InformeVehiculos = () => {
    const navigate = useNavigate()
    const { informes, loading, error, deleteInforme } = useInformeVehiculos()
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
            alert('Error eliminando informe: ' + err.message)
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
                'Buen estado': 'green',
                'Requiere atención': 'orange',
                'Malo': 'red'
            }
            return colors[status] || 'gray'
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Informe de Vehículo #${reportData.id}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #333;
                        margin: 0;
                    }
                    .section {
                        margin-bottom: 30px;
                        border: 1px solid #ddd;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .section h2 {
                        color: #333;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                        margin-top: 0;
                    }
                    .row {
                        display: flex;
                        margin-bottom: 10px;
                    }
                    .col {
                        flex: 1;
                        margin-right: 20px;
                    }
                    .col:last-child {
                        margin-right: 0;
                    }
                    .label {
                        font-weight: bold;
                        color: #555;
                    }
                    .status {
                        padding: 2px 8px;
                        border-radius: 3px;
                        color: white;
                        font-size: 12px;
                    }
                    .status-green { background-color: green; }
                    .status-orange { background-color: orange; }
                    .status-red { background-color: red; }
                    .image-container {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .image-container img {
                        max-width: 300px;
                        max-height: 200px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    @media print {
                        body { margin: 0; }
                        .section { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Informe de Inspección de Vehículo</h1>
                    <p><strong>ID del Informe:</strong> ${reportData.id}</p>
                </div>

                <div class="section">
                    <h2>Información General</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Fecha de Ingreso:</span> ${formatDate(reportData.fecha_ingreso)}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Datos del Cliente</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Nombre:</span> ${reportData.cliente_nombre}
                        </div>
                        <div class="col">
                            <span class="label">Teléfono:</span> ${reportData.cliente_telefono || 'N/A'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Email:</span> ${reportData.cliente_email || 'N/A'}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Datos del Vehículo</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Marca:</span> ${reportData.vehiculo_marca}
                        </div>
                        <div class="col">
                            <span class="label">Modelo:</span> ${reportData.vehiculo_modelo}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Año:</span> ${reportData.vehiculo_anio}
                        </div>
                        <div class="col">
                            <span class="label">Color:</span> ${reportData.vehiculo_color}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">VIN:</span> ${reportData.vehiculo_vin || 'N/A'}
                        </div>
                        <div class="col">
                            <span class="label">Kilometraje:</span> ${reportData.vehiculo_kilometraje || 'N/A'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Fecha Shaken:</span> ${reportData.vehiculo_fecha_shaken ? formatDate(reportData.vehiculo_fecha_shaken) : 'N/A'}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Estado del Vehículo</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Estado de la Batería:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_bateria)}">${reportData.vehiculo_estado_bateria}</span>
                        </div>
                        <div class="col">
                            <span class="label">Estado del Aceite:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_aceite)}">${reportData.vehiculo_estado_aceite}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Estado Líquido de Frenos:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_liquido_frenos)}">${reportData.vehiculo_estado_liquido_frenos}</span>
                        </div>
                        <div class="col">
                            <span class="label">Estado Líquido Refrigerante:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_liquido_refrigerante)}">${reportData.vehiculo_estado_liquido_refrigerante}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Porcentaje Pastillas de Freno:</span> ${reportData.vehiculo_porcentaje_pastillas_freno}%
                        </div>
                        <div class="col">
                            <span class="label">Porcentaje Neumáticos:</span> ${reportData.vehiculo_porcentaje_neumaticos}%
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Información Adicional</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Detalles de Pintura:</span><br>
                            ${reportData.vehiculo_detalles_pintura || 'N/A'}
                        </div>
                        <div class="col">
                            <span class="label">Observación General:</span><br>
                            ${reportData.vehiculo_observacion_general || 'N/A'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col" style="width: 100%;">
                            <span class="label">Trabajos a Realizar:</span><br>
                            ${reportData.vehiculo_trabajos_realizar || 'N/A'}
                        </div>
                    </div>
                </div>

                ${reportData.vehiculo_imagen || reportData.vehiculo_foto_documentos ? `
                <div class="section">
                    <h2>Imágenes</h2>
                    <div class="row">
                        ${reportData.vehiculo_imagen ? `
                        <div class="col">
                            <span class="label">Imagen del Vehículo:</span>
                            <div class="image-container">
                                <img src="${hostUrl}/uploads/${reportData.vehiculo_imagen}" alt="Vehículo" />
                            </div>
                        </div>
                        ` : ''}
                        ${reportData.vehiculo_foto_documentos ? `
                        <div class="col">
                            <span class="label">Foto de Documentos:</span>
                            <div class="image-container">
                                <img src="${hostUrl}/uploads/${reportData.vehiculo_foto_documentos}" alt="Documentos" />
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <div class="section" style="text-align: center; margin-top: 50px;">
                    <p><strong>Fecha de Impresión:</strong> ${new Date().toLocaleDateString('es-VE')} ${new Date().toLocaleTimeString('es-VE')}</p>
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
                                                            className="btn btn-sm btn-primary me-2"
                                                            onClick={() => printReport(informe)}
                                                        >
                                                            Imprimir
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
                                                    <p><strong>VIN:</strong> {selectedInforme.vehiculo_vin || 'N/A'}</p>
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
                                                    <p><strong>Detalles de Pintura:</strong></p>
                                                    <p>{selectedInforme.vehiculo_detalles_pintura || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Observación General:</strong></p>
                                                    <p>{selectedInforme.vehiculo_observacion_general || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p><strong>Trabajos a Realizar:</strong></p>
                                                    <p>{selectedInforme.vehiculo_trabajos_realizar || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Images */}
                                    {(selectedInforme.vehiculo_imagen || selectedInforme.vehiculo_foto_documentos) && (
                                        <div className="card">
                                            <div className="card-header">
                                                <h6>Imágenes</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    {selectedInforme.vehiculo_imagen && (
                                                        <div className="col-md-6">
                                                            <p><strong>Imagen del Vehículo:</strong></p>
                                                            <img
                                                                src={`${hostUrl}/uploads/${selectedInforme.vehiculo_imagen}`}
                                                                alt="Vehículo"
                                                                className="img-fluid"
                                                                style={{ maxHeight: '200px' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {selectedInforme.vehiculo_foto_documentos && (
                                                        <div className="col-md-6">
                                                            <p><strong>Foto de Documentos:</strong></p>
                                                            <img
                                                                src={`${hostUrl}/uploads/${selectedInforme.vehiculo_foto_documentos}`}
                                                                alt="Documentos"
                                                                className="img-fluid"
                                                                style={{ maxHeight: '200px' }}
                                                            />
                                                        </div>
                                                    )}
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
