

import useInspeccionVehicular from '../../hooks/useInspeccionVehicular'
import useConfiguracion from '../../hooks/useConfiguracion'
import { topurl } from '../../utils/globals'
import ClientInformation from '../../components/ClientInformation'
import carrito from '../../assets/carrito.png'

const InspeccionVehicular = () => {
    const {
        loading,
        error,
        modalOpen,
        setModalOpen,
        editing,
        form,
        uploadingImages,
        imageUploadErrors,
        inspecciones,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        handleSave,
        handleDelete,
        loadCar
    } = useInspeccionVehicular()



    // Adapt form data for ClientInformation component
    const invoiceData = {
        clientName: form.cliente_nombre,
        clientEmail: form.cliente_email,
        clientPhone: form.cliente_telefono,
        clientAddress: form.cliente_direccion
    }

    const setInvoiceData = (newData) => {
        handleChange({ target: { name: 'cliente_nombre', value: newData.clientName } })
        handleChange({ target: { name: 'cliente_email', value: newData.clientEmail } })
        handleChange({ target: { name: 'cliente_telefono', value: newData.clientPhone } })
        handleChange({ target: { name: 'cliente_direccion', value: newData.clientAddress } })
    }

    const { getPhones, getEmails, getCompanyName, getCompanyAddress } = useConfiguracion()

    const printInspection = async (inspeccion) => {


        const companyName = getCompanyName().length > 0 ? getCompanyName()[0].texto : 'SANOCARS'
        const companyAddress = getCompanyAddress().length > 0 ? getCompanyAddress()[0].texto : 'Dirección no configurada'
        const phone = getPhones().length > 0 ? getPhones()[0].texto : 'Teléfono no configurado'
        const email = getEmails().length > 0 ? getEmails()[0].texto : 'Email no configurado'

        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Inspección Vehicular #${inspeccion.id}</title>
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
                        <div class="invoice-header">
                            <div>
                                <h2>Inspección de Vehículos</h2>
                                <div>
                                    <div>${new Date().toLocaleDateString('es-VE')} - ${new Date().toLocaleTimeString('es-VE')}</div>
                                    <div>ID: #${inspeccion.id}</div>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <h1>${companyName}</h1>
                                Dirección: ${companyAddress} <br>
                                Teléfono: ${phone}<br>
                                Email: ${email}
                            </div>
                        </div>

                        <!-- Client Information -->
                        <div class="">
                            <div class="section-header">Información del Cliente</div>
                            <div class="section-content">
                                <div class="info-grid-2">
                                    <div class="info-item">
                                        <div class="info-label">Nombre</div>
                                        <div class="info-value">${inspeccion.cliente_nombre || 'N/A'}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Teléfono</div>
                                        <div class="info-value">${inspeccion.cliente_telefono || 'N/A'}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Email</div>
                                        <div class="info-value">${inspeccion.cliente_email || 'N/A'}</div>
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
                                        <div class="info-value">${inspeccion.vehiculo_marca}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Modelo</div>
                                        <div class="info-value">${inspeccion.vehiculo_modelo}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Año</div>
                                        <div class="info-value">${inspeccion.vehiculo_anio}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Color</div>
                                        <div class="info-value">${inspeccion.vehiculo_color}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Placa</div>
                                        <div class="info-value">${inspeccion.vehiculo_placa}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Estado Aceite</div>
                                        <div class="info-value">
                                            <span class="status-badge" style="background-color: ${inspeccion.vehiculo_estado_aceite === 'Excelente' || inspeccion.vehiculo_estado_aceite === 'Bueno' ? '#d4edda' : inspeccion.vehiculo_estado_aceite === 'Regular' ? '#fff3cd' : '#f8d7da'}">${inspeccion.vehiculo_estado_aceite}</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Fecha Shaken</div>
                                        <div class="info-value">${inspeccion.vehiculo_fecha_shaken ? new Date(inspeccion.vehiculo_fecha_shaken).toLocaleDateString('es-VE') : 'N/A'}</div>
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
                                            <span class="status-badge" style="background-color: ${inspeccion.vehiculo_estado_bateria === 'Excelente' || inspeccion.vehiculo_estado_bateria === 'Bueno' ? '#d4edda' : inspeccion.vehiculo_estado_bateria === 'Regular' ? '#fff3cd' : '#f8d7da'}">${inspeccion.vehiculo_estado_bateria}</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Pastillas de Freno</div>
                                        <div class="info-value">${inspeccion.vehiculo_pastillas_freno}%</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Neumáticos</div>
                                        <div class="info-value">${inspeccion.vehiculo_neumaticos || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Additional Information -->
                        ${inspeccion.vehiculo_observaciones || inspeccion.vehiculo_trabajos_realizar || inspeccion.vehiculo_detalles_pintura ? `
                        <div class="section">
                            <div class="section-header">Información Adicional</div>
                            <div class="section-content">
                                <div class="info-grid">
                                    ${inspeccion.vehiculo_observaciones ? `
                                    <div class="info-item" style="height:200px">
                                        <div class="info-label">Observaciones</div>
                                        <div class="text-area">${inspeccion.vehiculo_observaciones}</div>
                                    </div>
                                    ` : ''}
                                    ${inspeccion.vehiculo_trabajos_realizar ? `
                                    <div class="info-item" style="height:200px">
                                        <div class="info-label">Trabajos a Realizar</div>
                                        <div class="text-area">${inspeccion.vehiculo_trabajos_realizar}</div>
                                    </div>
                                    ` : ''}
                                </div>
                                <div class="info-grid" style="grid-template-columns: repeat(2, 1fr);">
                                    <div class="company-info-section">
                                        <img src="${carrito}" height="220px" />
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Detalles de Pintura</div>
                                        <div class="text-area">${inspeccion.vehiculo_detalles_pintura || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </body>
            </html>
        `)
        printWindow.document.close()
        printWindow.print()

    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Inspección Vehicular</h2>
                        <div>
                            <button className="btn btn-primary" onClick={openNew}>Nueva Inspección</button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="card">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4">Cargando inspecciones...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Cliente</th>
                                                <th>Vehículo</th>
                                                <th>Placa</th>
                                                <th>Estado Aceite</th>
                                                <th>Pastillas (%)</th>
                                                <th>Neumáticos</th>
                                                <th>Fecha Shaken</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inspecciones && inspecciones.length > 0 ? (
                                                inspecciones.map(inspeccion => (
                                                    <tr key={inspeccion.id}>
                                                        <td>
                                                            {inspeccion.cliente_tipo === 'registrado' ?
                                                                inspeccion.cliente_nombre :
                                                                inspeccion.cliente_nombre || 'N/A'
                                                            }
                                                        </td>
                                                        <td>{inspeccion.vehiculo_marca} {inspeccion.vehiculo_modelo} {inspeccion.vehiculo_anio}</td>
                                                        <td>{inspeccion.vehiculo_placa}</td>
                                                        <td>{inspeccion.vehiculo_estado_aceite}</td>
                                                        <td>{inspeccion.vehiculo_pastillas_freno}%</td>
                                                        <td>{inspeccion.vehiculo_neumaticos || 'N/A'}</td>
                                                        <td>{new Date(inspeccion.vehiculo_fecha_shaken).toLocaleDateString()}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info me-2" onClick={() => openEdit(inspeccion)}>Editar</button>
                                                            <button
                                                                className="btn btn-sm btn-primary me-2"
                                                                onClick={() => printInspection(inspeccion)}
                                                                disabled={!loadCar}
                                                            ><span class="sr-only" role="status" aria-hidden="true">Imprimir </span>
                                                                {!loadCar && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inspeccion)}>Eliminar</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center p-4">No hay inspecciones registradas</td>
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

            {/* Modal */}
            {modalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
            )}
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editing ? 'Editar Inspección' : 'Nueva Inspección'}</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        {/* Card 1: Información del Cliente */}
                                        <div className="col-md-6 mb-4">
                                            <ClientInformation
                                                invoiceData={invoiceData}
                                                setInvoiceData={setInvoiceData}
                                            />
                                        </div>

                                        {/* Card 2: Información del Vehículo */}
                                        <div className="col-md-6 mb-4">
                                            <div className="card h-100">
                                                <div className="card-header">
                                                    <h6 className="mb-0">Información del Vehículo</h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Marca</label>
                                                            <input name="vehiculo_marca" value={form.vehiculo_marca} onChange={handleChange} className="form-control" required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Modelo</label>
                                                            <input name="vehiculo_modelo" value={form.vehiculo_modelo} onChange={handleChange} className="form-control" required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Año</label>
                                                            <input name="vehiculo_anio" value={form.vehiculo_anio} onChange={handleChange} className="form-control" required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Color</label>
                                                            <input name="vehiculo_color" value={form.vehiculo_color} onChange={handleChange} className="form-control" required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Placa</label>
                                                            <input name="vehiculo_placa" value={form.vehiculo_placa} onChange={handleChange} className="form-control" required />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Fecha Shaken</label>
                                                            <input name="vehiculo_fecha_shaken" type="date" value={form.vehiculo_fecha_shaken} onChange={handleChange} className="form-control" />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Estado del Aceite</label>
                                                            <select name="vehiculo_estado_aceite" value={form.vehiculo_estado_aceite} onChange={handleChange} className="form-control" required>
                                                                <option value="">Seleccionar...</option>
                                                                <option value="Excelente">Excelente</option>
                                                                <option value="Bueno">Bueno</option>
                                                                <option value="Regular">Regular</option>
                                                                <option value="Malo">Malo</option>
                                                                <option value="Crítico">Crítico</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Pastillas de Freno (%)</label>
                                                            <input
                                                                name="vehiculo_pastillas_freno"
                                                                type="number"
                                                                min="1"
                                                                max="100"
                                                                value={form.vehiculo_pastillas_freno}
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Neumáticos</label>
                                                            <textarea
                                                                name="vehiculo_neumaticos"
                                                                value={form.vehiculo_neumaticos}
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                rows="2"
                                                                placeholder="Describa el estado de los neumáticos..."
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label">Estado de la Batería</label>
                                                            <select name="vehiculo_estado_bateria" value={form.vehiculo_estado_bateria} onChange={handleChange} className="form-control" required>
                                                                <option value="">Seleccionar...</option>
                                                                <option value="Excelente">Excelente</option>
                                                                <option value="Bueno">Bueno</option>
                                                                <option value="Regular">Regular</option>
                                                                <option value="Malo">Malo</option>
                                                                <option value="Crítico">Crítico</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Observaciones</label>
                                                        <textarea name="vehiculo_observaciones" value={form.vehiculo_observaciones} onChange={handleChange} className="form-control" rows="2" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Trabajos a realizar</label>
                                                        <textarea name="vehiculo_trabajos_realizar" value={form.vehiculo_trabajos_realizar} onChange={handleChange} className="form-control" rows="3" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Detalles de Pintura</label>
                                                        <textarea name="vehiculo_detalles_pintura" value={form.vehiculo_detalles_pintura} onChange={handleChange} className="form-control" rows="2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 3: Fotos */}
                                        <div className="col-md-12 mb-4">
                                            <div className="card h-100">
                                                <div className="card-header">
                                                    <h6 className="mb-0">Fotos</h6>
                                                </div>
                                                <div className="card-body d-flex">
                                                    <div className="mb-3 w-50">
                                                        <label className="form-label">Foto del Vehículo</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            onChange={(e) => handleImageChange('foto_vehiculo', e.target.files[0])}
                                                            accept="image/*"
                                                            disabled={uploadingImages.foto_vehiculo}
                                                        />
                                                        {uploadingImages.foto_vehiculo && (
                                                            <div className="mt-2">
                                                                <div className="spinner-border spinner-border-sm" role="status">
                                                                    <span className="visually-hidden">Subiendo...</span>
                                                                </div>
                                                                <span className="ms-2">Subiendo imagen...</span>
                                                            </div>
                                                        )}
                                                        {form.foto_vehiculo && !uploadingImages.foto_vehiculo && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={`${topurl}/uploads/${form.foto_vehiculo}`}
                                                                    alt="Vehículo"
                                                                    className="img-thumbnail"
                                                                    style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                                />
                                                            </div>
                                                        )}
                                                        {imageUploadErrors.foto_vehiculo && (
                                                            <div className="mt-2">
                                                                <small className="text-danger">{imageUploadErrors.foto_vehiculo}</small>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mb-3 w-50">
                                                        <label className="form-label">Foto del Documento</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            onChange={(e) => handleImageChange('foto_documento', e.target.files[0])}
                                                            accept="image/*"
                                                            disabled={uploadingImages.foto_documento}
                                                        />
                                                        {uploadingImages.foto_documento && (
                                                            <div className="mt-2">
                                                                <div className="spinner-border spinner-border-sm" role="status">
                                                                    <span className="visually-hidden">Subiendo...</span>
                                                                </div>
                                                                <span className="ms-2">Subiendo imagen...</span>
                                                            </div>
                                                        )}
                                                        {form.foto_documento && !uploadingImages.foto_documento && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={`${topurl}/uploads/${form.foto_documento}`}
                                                                    alt="Documento"
                                                                    className="img-thumbnail"
                                                                    style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                                />
                                                            </div>
                                                        )}
                                                        {imageUploadErrors.foto_documento && (
                                                            <div className="mt-2">
                                                                <small className="text-danger">{imageUploadErrors.foto_documento}</small>
                                                            </div>
                                                        )}
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='px-3'>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                </div>
                                <div className="modal-footer">

                                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={Object.values(uploadingImages).some(uploading => uploading)}
                                    >
                                        {editing ? 'Actualizar' : 'Guardar'} Inspección
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InspeccionVehicular
