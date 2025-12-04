

import useInspeccionVehicular from '../../hooks/useInspeccionVehicular'
import useConfiguracion from '../../hooks/useConfiguracion'
import { topurl } from '../../utils/globals'
import ClientInformation from '../../components/ClientInformation'

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
        handleDelete
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

    const printInspection = (inspeccion) => {
        const companyName = getCompanyName().length > 0 ? getCompanyName()[0].texto : 'SANOCARS'
        const companyAddress = getCompanyAddress().length > 0 ? getCompanyAddress()[0].texto : 'Dirección no configurada'
        const phone = getPhones().length > 0 ? getPhones()[0].texto : 'Teléfono no configurado'
        const email = getEmails().length > 0 ? getEmails()[0].texto : 'Email no configurado'

        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <html>
                <head>
                    <title>Inspección Vehicular #${inspeccion.id}</title>
                    <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #363636ff; padding-bottom: 20px; }
                            .header-left { text-align: left; }
                            .header-right { text-align: right; }
                            .company-name { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
                            .company-info { font-size: 12px; line-height: 1.5; }
                            .inspection-title { text-align: center; font-size: 14px; font-weight: bold; margin: 30px 0; }
                            .section { margin-bottom: 20px; }
                            .section-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #838383ff; padding-bottom: 5px; }
                            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                            .info-item { margin-bottom: 5px; }
                            .label { font-weight: bold; font-size:12px; }
                            .status-good { color: green; }
                            .status-bad { color: red; }
                            .status-regular { color: orange; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="header-left">
                            <div class="company-name">${companyName}</div>
                            <div class="company-info">
                                ${companyAddress}<br>
                                Tel: ${phone}<br>
                                Email: ${email}
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="company-info">
                                Fecha: ${new Date().toLocaleDateString('es-ES')}<br>
                                Inspección #${inspeccion.id}
                            </div>
                        </div>
                    </div>

                    <div class="inspection-title">REPORTE DE INSPECCIÓN VEHICULAR</div>

                    <div class="section">
                        <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
                        <div class="info-grid">
                            <div class="info-item"><span class="label">Nombre:</span> ${inspeccion.cliente_nombre || 'N/A'}</div>
                            <div class="info-item"><span class="label">Email:</span> ${inspeccion.cliente_email || 'N/A'}</div>
                            <div class="info-item"><span class="label">Teléfono:</span> ${inspeccion.cliente_telefono || 'N/A'}</div>
                            <div class="info-item"><span class="label">Dirección:</span> ${inspeccion.cliente_direccion || 'N/A'}</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">INFORMACIÓN DEL VEHÍCULO</div>
                        <div class="info-grid">
                            <div class="info-item"><span class="label">Marca:</span> ${inspeccion.vehiculo_marca}</div>
                            <div class="info-item"><span class="label">Modelo:</span> ${inspeccion.vehiculo_modelo}</div>
                            <div class="info-item"><span class="label">Año:</span> ${inspeccion.vehiculo_anio}</div>
                            <div class="info-item"><span class="label">Color:</span> ${inspeccion.vehiculo_color}</div>
                            <div class="info-item"><span class="label">Placa:</span> ${inspeccion.vehiculo_placa}</div>
                            <div class="info-item"><span class="label">Fecha Shaken:</span> ${new Date(inspeccion.vehiculo_fecha_shaken).toLocaleDateString() || 'N/A'}</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">ESTADO DE COMPONENTES</div>
                        <div class="info-grid">
                            <div class="info-item"><span class="label">Estado del Aceite:</span> <span class="${inspeccion.vehiculo_estado_aceite === 'Excelente' ? 'status-good' : inspeccion.vehiculo_estado_aceite === 'Bueno' ? 'status-good' : inspeccion.vehiculo_estado_aceite === 'Regular' ? 'status-regular' : 'status-bad'}">${inspeccion.vehiculo_estado_aceite}</span></div>
                            <div class="info-item"><span class="label">Pastillas de Freno:</span> ${inspeccion.vehiculo_pastillas_freno}% ${inspeccion.vehiculo_pastillas_freno > 50 ? '(Buen estado)' : inspeccion.vehiculo_pastillas_freno > 20 ? '(Regular)' : '(Requiere atención)'}</div>
                            <div class="info-item"><span class="label">Neumáticos:</span> ${inspeccion.vehiculo_neumaticos || 'No especificado'}</div>
                            <div class="info-item"><span class="label">Estado de la Batería:</span> <span class="${inspeccion.vehiculo_estado_bateria === 'Excelente' ? 'status-good' : inspeccion.vehiculo_estado_bateria === 'Bueno' ? 'status-good' : inspeccion.vehiculo_estado_bateria === 'Regular' ? 'status-regular' : 'status-bad'}">${inspeccion.vehiculo_estado_bateria}</span></div>
                        </div>
                    </div>

                    ${inspeccion.vehiculo_observaciones ? `
                    <div class="section">
                        <div class="section-title">OBSERVACIONES</div>
                        <p>${inspeccion.vehiculo_observaciones}</p>
                    </div>
                    ` : ''}

                    ${inspeccion.vehiculo_trabajos_realizar ? `
                    <div class="section">
                        <div class="section-title">TRABAJOS A REALIZAR</div>
                        <p>${inspeccion.vehiculo_trabajos_realizar}</p>
                    </div>
                    ` : ''}

                    ${inspeccion.vehiculo_detalles_pintura ? `
                    <div class="section">
                        <div class="section-title">DETALLES DE PINTURA</div>
                        <p>${inspeccion.vehiculo_detalles_pintura}</p>
                    </div>
                    ` : ''}
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
                                                            <button className="btn btn-sm btn-success me-2" onClick={() => printInspection(inspeccion)}>Imprimir</button>
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
