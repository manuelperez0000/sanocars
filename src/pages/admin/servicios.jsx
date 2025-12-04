
import useServicios from '../../hooks/useServicios'
import { topurl } from '../../utils/globals'
import useConfiguracion from '../../hooks/useConfiguracion'
import ClientInformation from '../../components/ClientInformation'

const Servicios = () => {

    const { getEmails, getPhones } = useConfiguracion()

    const {
        loading,
        error,
        modalOpen,
        setModalOpen,
        editing,
        form,
        setForm,
        uploadingImages,
        imageUploadErrors,
        detailsModalOpen,
        currentDetail,
        ivaModalOpen,
        ivaPercentage,
        setIvaPercentage,
        servicios,
        openNew,
        openEdit,
        handleChange,
        openDetailsModal,
        closeDetailsModal,
        handleDetailChange,
        saveDetail,
        removeDetail,
        openIvaModal,
        closeIvaModal,
        saveIvaPercentage,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleDelete
    } = useServicios()

    const printInvoice = (servicio) => {
        // Parse service details if it's a string
        let detalles = servicio.detalles
        if (typeof detalles === 'string') {
            try {
                detalles = JSON.parse(detalles)
            } catch {
                detalles = []
            }
        }

        // Calculate IVA percentage from the totals
        const subtotal = parseInt(servicio.subtotal || 0)
        const iva = parseInt(servicio.iva || 10)
        const ivaPercentage = subtotal > 0 ? (iva / subtotal * 100) : 0

        const printWindow = window.open('', '_blank')
        const invoiceHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura de Servicio - ${servicio.id}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.4;
                    }
                        .text-left { text-align: left; }
                    .invoice-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .invoice-title {
                        font-size: 28px;
                        font-weight: bold;
                        color: #202122ff;
                    }
                    .invoice-subtitle {
                        font-size: 16px;
                        color: #242424ff;
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
                    .service-details {
                        margin-bottom: 30px;
                    }
                    .service-details h4 {
                        margin: 0 0 15px 0;
                        color: #2c3e50;
                        font-size: 16px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                        font-size: 14px;
                    }
                    th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .totals-section {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .totals-box {
                        border: 1px solid #ddd;
                        padding: 20px;
                        background-color: #f8f9fa;
                        min-width: 250px;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                    .totals-row.total {
                        border-top: 2px solid #333;
                        padding-top: 10px;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .notes-section {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                    .notes-section h4 {
                        margin: 0 0 10px 0;
                        color: #2c3e50;
                        font-size: 14px;
                    }
                    .notes-section p {
                        margin: 0;
                        font-size: 14px;
                        white-space: pre-wrap;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #7f8c8d;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                        .flex-between {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div class="flex-between">
                        <div class="text-left">
                            <h2>Factura de Servicio</h2>
                            <p>Servicio #${servicio.id}</p>
                            <div>${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</div>
                        </div>
                        <div style="text-align: right;">
                            <h1>SANOCARS</h1>
                            Dirección: Numazu Shizuoka, Japón <br>
                            Teléfono: ${getPhones()[0]?.texto || '080 9117 1993'}<br>
                            Email: ${getEmails()[0]?.texto || 'sanocars@hotmail.com'}
                        </div>
                    </div>
                </div>
                <div class="invoice-info">
                    <div class="info-section">
                        <h4>Información del Cliente</h4>
                        <p><strong>Nombre:</strong> ${servicio.nombre_cliente || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> ${servicio.telefono_cliente || 'N/A'}</p>
                        <p><strong>Email:</strong> ${servicio.email_cliente || 'N/A'}</p>
                    </div>
                    <div class="info-section">
                        <h4>Información del Vehículo</h4>
                        <p><strong>Marca:</strong> ${servicio.marca_vehiculo || 'N/A'}</p>
                        <p><strong>Modelo:</strong> ${servicio.modelo_vehiculo || 'N/A'}</p>
                        <p><strong>Año:</strong> ${servicio.anio_vehiculo || 'N/A'}</p>
                        <p><strong>Placa:</strong> ${servicio.placa_vehiculo || 'N/A'}</p>
                        <p><strong>Color:</strong> ${servicio.color_vehiculo || 'N/A'}</p>
                        <p><strong>Kilometraje:</strong> ${servicio.kilometraje_vehiculo || 'N/A'}</p>
                    </div>
                    <div class="info-section">
                        <h4>Información del Servicio</h4>
                        <p><strong>Fecha:</strong> ${new Date(servicio.fecha_servicio).toLocaleDateString('es-ES')}</p>
                        ${servicio.notas ? `
                        <div class="notes-section">
                            <h4>Notas</h4>
                            <p>${servicio.notas}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="service-details">
                    <h4>Detalles del Servicio</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detalles && detalles.length > 0 ? detalles.map(detail => `
                                <tr>
                                    <td>${detail.descripcion || ''}</td>
                                    <td class="text-right">${detail.cantidad || 0}</td>
                                    <td class="text-right">¥${parseInt(detail.precio_unitario || 0)}</td>
                                    <td class="text-right">¥${parseInt(detail.total || 0)}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" style="text-align: center;">No hay detalles disponibles</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <div class="totals-section">
                    <div class="totals-box">
                        <div class="totals-row">
                            <span>Subtotal:</span>
                            <span>¥${parseInt(servicio.subtotal || 0)}</span>
                        </div>
                        <div class="totals-row">
                            <span>IVA (${ivaPercentage}%):</span>
                            <span>¥${parseInt(servicio.iva || 0)}</span>
                        </div>
                        <div class="totals-row total">
                            <span>Total:</span>
                            <span>¥${parseInt(servicio.total || 0)}</span>
                        </div>
                    </div>
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
                        <h2 className="mb-0">Gestión de Servicios</h2>
                        <div>
                            <button className="btn btn-primary" onClick={openNew}>Nuevo servicio</button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="card">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4">Cargando servicios...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Cliente</th>
                                                <th>Vehículo</th>
                                                <th>Fecha Shaken</th>
                                                <th>Fecha</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {servicios && servicios.length > 0 ? (
                                                servicios.map(s => (
                                                    <tr key={s.id}>
                                                        <td>{s.id}</td>
                                                        <td>{s.nombre_cliente}</td>
                                                        <td>{s.marca_vehiculo} {s.modelo_vehiculo} ({s.placa_vehiculo})</td>
                                                        <td>{s.fecha_shaken ? new Date(s.fecha_shaken).toLocaleDateString() : '-'}</td>
                                                        <td>{new Date(s.fecha_servicio).toLocaleDateString()}</td>
                                                        <td>¥{parseInt(s.total || 0)}</td>
                                                        <td>
                                                            <span className={`badge ${s.status === 'Completado' ? 'bg-success' : s.status === 'En Progreso' ? 'bg-warning' : 'bg-secondary'}`}>
                                                                {s.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info me-2" onClick={() => openEdit(s)}>Editar</button>
                                                            <button className="btn btn-sm btn-success me-2" onClick={() => printInvoice(s)}>Imprimir</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s)}>Eliminar</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center p-4">No hay servicios registrados</td>
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

            {/* Main Modal */}
            {modalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
            )}
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editing ? 'Editar servicio' : 'Nuevo servicio'}</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Client Data Section */}
                                    <ClientInformation
                                        invoiceData={{
                                            clientName: form.nombre_cliente || '',
                                            clientEmail: form.email_cliente || '',
                                            clientPhone: form.telefono_cliente || '',
                                            clientAddress: form.direccion_cliente || ''
                                        }}
                                        setInvoiceData={(updatedData) => {
                                            setForm(prev => ({
                                                ...prev,
                                                nombre_cliente: updatedData.clientName || '',
                                                email_cliente: updatedData.clientEmail || '',
                                                telefono_cliente: updatedData.clientPhone || '',
                                                direccion_cliente: updatedData.clientAddress || ''
                                            }))
                                        }}
                                    />

                                    {/* Vehicle Data Section */}
                                    <div className="mb-4">
                                        <h6 className="text-primary mb-3">Datos del Vehículo</h6>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Marca *</label>
                                                <input name="marca_vehiculo" value={form.marca_vehiculo || ''} onChange={handleChange} className="form-control" required />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Modelo *</label>
                                                <input name="modelo_vehiculo" value={form.modelo_vehiculo || ''} onChange={handleChange} className="form-control" required />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Año</label>
                                                <input name="anio_vehiculo" value={form.anio_vehiculo || ''} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Placa *</label>
                                                <input name="placa_vehiculo" value={form.placa_vehiculo || ''} onChange={handleChange} className="form-control" required />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Color</label>
                                                <input name="color_vehiculo" value={form.color_vehiculo || ''} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Kilometraje</label>
                                                <input name="kilometraje_vehiculo" value={form.kilometraje_vehiculo || ''} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Fecha Shaken</label>
                                                <input type="date" name="fecha_shaken" value={form.fecha_shaken || ''} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Details Section */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="text-primary mb-0">Detalles del Servicio</h6>
                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openDetailsModal()}>
                                                Agregar Detalles del servicio
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Descripción</th>
                                                        <th>Cantidad</th>
                                                        <th>Precio Unit.</th>
                                                        <th>Total</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {form.detalles && form.detalles.length > 0 ? (
                                                        form.detalles.map((detail, index) => (
                                                            <tr key={index}>
                                                                <td>{detail.descripcion}</td>
                                                                <td>{detail.cantidad}</td>
                                                                <td>¥{parseInt(detail.precio_unitario || 0)}</td>
                                                                <td>¥{parseInt(detail.total || 0)}</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-sm btn-warning me-1" onClick={() => openDetailsModal(detail, index)}>
                                                                        Editar
                                                                    </button>
                                                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeDetail(index)}>
                                                                        Eliminar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="text-center text-muted">No hay items agregados</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Totals Section */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="text-primary mb-0">Totales</h6>
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={openIvaModal}>
                                                Editar IVA ({ivaPercentage}%)
                                            </button>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="border p-3 rounded">
                                                    <div className="d-flex justify-content-between">
                                                        <strong>Subtotal:</strong>
                                                        <span>¥{parseInt(form.subtotal || 0)}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <strong>IVA ({ivaPercentage}%):</strong>
                                                        <span>¥{parseInt(form.iva || 0)}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="d-flex justify-content-between">
                                                        <strong>Total:</strong>
                                                        <span className="text-primary">¥{parseInt(form.total || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="mb-4">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Fecha del Servicio</label>
                                                <input type="date" name="fecha_servicio" value={form.fecha_servicio || ''} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Status</label>
                                                <select name="status" value={form.status || 'Pendiente'} onChange={handleChange} className="form-control">
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="En Progreso">En Progreso</option>
                                                    <option value="Completado">Completado</option>
                                                    <option value="Cancelado">Cancelado</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Notas</label>
                                            <textarea name="notas" value={form.notas || ''} onChange={handleChange} className="form-control" rows="3"></textarea>
                                        </div>
                                    </div>

                                    {/* Photos Section */}
                                    <div className="mb-4">
                                        <label className="form-label">Fotos</label>
                                        {form.fotos && form.fotos.map((foto, index) => (
                                            <div key={index} className="mb-3 p-3 border rounded">
                                                <div className="d-flex align-items-center mb-2">
                                                    <input
                                                        type="file"
                                                        name="foto"
                                                        id={`foto-${index}`}
                                                        className="form-control me-2"
                                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                                        accept="image/*"
                                                        disabled={uploadingImages[index]}
                                                    />
                                                    {uploadingImages[index] && (
                                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                                            <span className="visually-hidden">Subiendo...</span>
                                                        </div>
                                                    )}
                                                    {foto && !uploadingImages[index] && (
                                                        <>
                                                            <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '1.2rem' }}></i>
                                                            <small className="text-muted me-2">{foto}</small>
                                                        </>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeImageInput(index)}
                                                        disabled={uploadingImages[index]}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                                {foto && !uploadingImages[index] && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={`${topurl}/uploads/${foto}`}
                                                            alt={`Preview ${foto}`}
                                                            className="img-thumbnail"
                                                            style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                        />
                                                    </div>
                                                )}
                                                {imageUploadErrors[index] && (
                                                    <div className="mt-2">
                                                        <small className="text-danger">{imageUploadErrors[index]}</small>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={addImageInput}
                                        >
                                            Agregar foto
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={Object.values(uploadingImages).some(uploading => uploading)}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {detailsModalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1060 }}></div>
            )}
            {detailsModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1070 }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar Item del Servicio</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeDetailsModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Descripción *</label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        value={currentDetail.descripcion || ''}
                                        onChange={handleDetailChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Cantidad</label>
                                        <input
                                            type="number"
                                            name="cantidad"
                                            value={currentDetail.cantidad || 1}
                                            onChange={handleDetailChange}
                                            className="form-control"
                                            min="1"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Precio en ¥</label>
                                        <input
                                            type="number"
                                            name="precio_unitario"
                                            value={currentDetail.precio_unitario}
                                            onChange={handleDetailChange}
                                            className="form-control"
                                            step="1"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Total: ¥{((parseInt(currentDetail.cantidad) || 1) * (parseInt(currentDetail.precio_unitario) || 0))}</strong>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeDetailsModal}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={saveDetail}>Guardar Item</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* IVA Modal */}
            {ivaModalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1080 }}></div>
            )}
            {ivaModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1090 }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Porcentaje de IVA</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeIvaModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Porcentaje de IVA (%)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={ivaPercentage}
                                        onChange={(e) => setIvaPercentage(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        step="1"
                                    />
                                    <small className="form-text text-muted">
                                        IVA actual: {ivaPercentage}% (${(parseInt(form.subtotal || 0) * (ivaPercentage / 100))})
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeIvaModal}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={saveIvaPercentage}>Aplicar IVA</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Servicios
