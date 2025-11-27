import useVehicles from '../../hooks/useVehicles'
import { topurl } from '../../utils/globals'
import ClientInformation from '../../components/ClientInformation'
import { useNavigate } from 'react-router-dom' 

const Vehiculos = () => {
    const navigate = useNavigate()
    const {
        loading,
        error,
        filter,
        setFilter,
        modalOpen,
        setModalOpen,
        editing,
        form,
        uploadingImages,
        imageUploadErrors,
        salesModalOpen,
        selectedVehicle,
        salesForm,
        rentalModalOpen,
        selectedRentalVehicle,
        rentalForm,
        visibleVehicles,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleMarkAsDeleted,
        openSalesModal,
        closeSalesModal,
        handleSalesChange,
        handleSaveSale,
        openRentalModal,
        closeRentalModal,
        handleRentalChange,
        handleSaveRental,
        getImages
    } = useVehicles()

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Gestión de Vehículos</h2>
                        <div>
                            <button className="btn btn-info me-2" onClick={() => navigate('/admin/alquilados') }>Vehículos en alquiler</button>
                            <button className="btn btn-primary" onClick={openNew}>Nuevo vehículo</button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="card">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4">Cargando vehículos...</div>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center p-3 gap-2">
                                        <div>Filtrar:</div>
                                        <div className="btn-group" role="group">
                                            <button type="button" className={`btn btn-sm ${filter === 'En Venta' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('En Venta')}>En venta</button>
                                            <button type="button" className={`btn btn-sm ${filter === 'En alquiler' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('En alquiler')}>En alquiler</button>
                                            <button type="button" className={`btn btn-sm ${filter === 'vendido' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('vendido')}>Vendidos</button>
                                            <button type="button" className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>Todos</button>
                                            <button type="button" className={`btn btn-sm ${filter === 'eliminado' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('eliminado')}>Eliminados</button>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Imagenes</th>
                                                    <th>Marca</th>
                                                    <th>Modelo</th>
                                                    <th>Año</th>
                                                    <th>Kms</th>
                                                    <th>Color</th>
                                                    <th>Fecha Shaken</th>
                                                    <th>Status</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleVehicles && visibleVehicles.length > 0 ? (
                                                    visibleVehicles.map(v => (
                                                        <tr key={v.id}>
                                                            <td>{v.id}</td>
                                                            <td>{getImages(v.imagen1)}</td>
                                                            <td>{v.marca}</td>
                                                            <td>{v.modelo}</td>
                                                            <td>{v.anio}</td>
                                                            <td>{v.kilometraje}</td>
                                                            <td>{v.color}</td>
                                                            <td>{v.fecha_shaken || '-'}</td>
                                                            <td>{v.status}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-info me-2" onClick={() => openEdit(v)}>Editar</button>
                                                                {v.status === 'En Venta' && (
                                                                    <button className="btn btn-sm btn-success me-2" onClick={() => openSalesModal(v)}>Vender</button>
                                                                )}
                                                                {v.status === 'En alquiler' && (
                                                                    <button className="btn btn-sm btn-warning me-2" onClick={() => openRentalModal(v)}>Alquilar</button>
                                                                )}
                                                                <button className="btn btn-sm btn-danger" onClick={() => handleMarkAsDeleted(v)}>Eliminar</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={10} className="text-center p-4">No hay vehículos</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>)}
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
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editing ? 'Editar vehículo' : 'Nuevo vehículo'}</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Marca</label>
                                            <input name="marca" value={form.marca || ''} onChange={handleChange} className="form-control" required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Modelo</label>
                                            <input name="modelo" value={form.modelo || ''} onChange={handleChange} className="form-control" required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Año</label>
                                            <input name="anio" value={form.anio || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Kilometraje</label>
                                            <input name="kilometraje" value={form.kilometraje || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Color</label>
                                            <input name="color" value={form.color || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Número de placa</label>
                                            <input name="numero_placa" value={form.numero_placa || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Número de chasis</label>
                                            <input name="numero_chasis" value={form.numero_chasis || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Origen</label>
                                            <input name="origen" value={form.origen || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Tipo</label>
                                            <input name="tipo_vehiculo" value={form.tipo_vehiculo || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Status</label>
                                            <select name="status" value={form.status || 'En Venta'} onChange={handleChange} className="form-control" required>
                                                <option value="En Venta">En Venta</option>
                                                <option value="En alquiler">En alquiler</option>
                                                <option value="vendido">Vendido</option>
                                                <option value="eliminado">Eliminado</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Fecha de ingreso</label>
                                            <input type="date" name="fecha_ingreso" value={form.fecha_ingreso || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Fecha de shaken</label>
                                            <input type="date" name="fecha_shaken" value={form.fecha_shaken || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Trabajos a realizar</label>
                                            <textarea name="trabajos_realizar" value={form.trabajos_realizar || ''} onChange={handleChange} className="form-control" rows="2"></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Tamaño motor</label>
                                            <input name="tamano_motor" value={form.tamano_motor || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Observaciones</label>
                                            <textarea name="observaciones" value={form.observaciones || ''} onChange={handleChange} className="form-control" rows="3"></textarea>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Imágenes</label>
                                            {form.imagenes && form.imagenes.map((imagen, index) => (
                                                <div key={index} className="mb-3 p-3 border rounded">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            id={`image-${index}`}
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
                                                        {imagen && !uploadingImages[index] && (
                                                            <>
                                                                <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '1.2rem' }}></i>
                                                                <small className="text-muted me-2">{imagen}</small>
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
                                                    {imagen && !uploadingImages[index] && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={`${topurl}/uploads/${imagen}`}
                                                                alt={`Preview ${imagen}`}
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
                                                Agregar imagen
                                            </button>
                                        </div>
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

            {/* Sales Modal */}
            {salesModalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1060 }}></div>
            )}
            {salesModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1070 }}>
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSaveSale}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Vender Vehículo: {selectedVehicle?.marca} {selectedVehicle?.modelo}</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeSalesModal}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Client Data Section */}
                                    <ClientInformation
                                        invoiceData={{
                                            clientName: salesForm.cliente_nombre || '',
                                            clientEmail: salesForm.cliente_email || '',
                                            clientPhone: salesForm.cliente_telefono || '',
                                            clientAddress: salesForm.cliente_direccion || ''
                                        }}
                                        setInvoiceData={(updatedData) => {
                                            handleSalesChange({ target: { name: 'cliente_nombre', value: updatedData.clientName || '' } })
                                            handleSalesChange({ target: { name: 'cliente_email', value: updatedData.clientEmail || '' } })
                                            handleSalesChange({ target: { name: 'cliente_telefono', value: updatedData.clientPhone || '' } })
                                            handleSalesChange({ target: { name: 'cliente_direccion', value: updatedData.clientAddress || '' } })
                                        }}
                                    />
                                    

                                    {/* Payment Section */}
                                    <div className="mb-4">
                                        <h6 className="text-primary mb-3">Información del Pago</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Tipo de Pago *</label>
                                                <select name="tipo_pago" value={salesForm.tipo_pago || 'contado'} onChange={handleSalesChange} className="form-control" required>
                                                    <option value="contado">De Contado</option>
                                                    <option value="cuotas">A Cuotas</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Precio de Venta *</label>
                                                <input
                                                    type="number"
                                                    name="precio_venta"
                                                    value={salesForm.precio_venta || ''}
                                                    onChange={handleSalesChange}
                                                    className="form-control"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {salesForm.tipo_pago === 'cuotas' && (
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Fecha Inicial *</label>
                                                    <input
                                                        type="date"
                                                        name="fecha_inicial"
                                                        value={salesForm.fecha_inicial || ''}
                                                        onChange={handleSalesChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Número de Cuotas</label>
                                                    <input
                                                        type="number"
                                                        name="numero_cuotas"
                                                        value={salesForm.numero_cuotas || 1}
                                                        onChange={handleSalesChange}
                                                        className="form-control"
                                                        min="1"
                                                        max="60"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Frecuencia</label>
                                                    <select name="frecuencia_cuotas" value={salesForm.frecuencia_cuotas || 'mensual'} onChange={handleSalesChange} className="form-control">
                                                        <option value="semanal">Semanal</option>
                                                        <option value="quincenal">Quincenal</option>
                                                        <option value="mensual">Mensual</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Monto Inicial</label>
                                                    <input
                                                        type="number"
                                                        name="monto_inicial"
                                                        value={salesForm.monto_inicial || 0}
                                                        onChange={handleSalesChange}
                                                        className="form-control"
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Tasa de Interés (%)</label>
                                                    <input
                                                        type="number"
                                                        name="tasa_interes"
                                                        value={salesForm.tasa_interes || 0}
                                                        onChange={handleSalesChange}
                                                        className="form-control"
                                                        step="0.01"
                                                        min="0"
                                                        max="50"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals Section */}
                                    <div className="mb-4">
                                        <h6 className="text-primary mb-3">Resumen de la Venta</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="border p-3 rounded">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <strong>Precio de Venta:</strong>
                                                        <span>${parseFloat(salesForm.precio_venta || 0).toFixed(2)}</span>
                                                    </div>
                                                    {salesForm.tipo_pago === 'cuotas' && (
                                                        <>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <strong>Menos Inicial:</strong>
                                                                <span>-${parseFloat(salesForm.monto_inicial || 0).toFixed(2)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <strong>Financiamiento:</strong>
                                                                <span>${(parseFloat(salesForm.precio_venta || 0) - parseFloat(salesForm.monto_inicial || 0)).toFixed(2)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <strong>Intereses ({salesForm.tasa_interes}%):</strong>
                                                                <span>${((parseFloat(salesForm.precio_venta || 0) - parseFloat(salesForm.monto_inicial || 0)) * (parseFloat(salesForm.tasa_interes || 0) / 100)).toFixed(2)}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    <hr />
                                                    <div className="d-flex justify-content-between">
                                                        <strong>Total a Pagar:</strong>
                                                        <span className="text-primary">${parseFloat(salesForm.total_con_intereses || 0).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {salesForm.tipo_pago === 'cuotas' && salesForm.siguientes_pagos && salesForm.siguientes_pagos.length > 0 && (
                                                <div className="col-md-6">
                                                    <div className="border p-3 rounded">
                                                        <h6 className="mb-3">Cronograma de Pagos</h6>
                                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                            <table className="table table-sm table-borderless mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="ps-0">Cuota</th>
                                                                        <th>Fecha</th>
                                                                        <th className="text-end pe-0">Monto</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {salesForm.siguientes_pagos.map((pago, index) => (
                                                                        <tr key={index}>
                                                                            <td className="ps-0">{pago.numero_cuota}</td>
                                                                            <td>{new Date(pago.fecha_pago).toLocaleDateString('es-ES')}</td>
                                                                            <td className="text-end pe-0">${pago.monto}</td>
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
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeSalesModal}>Cancelar</button>
                                    {/* <button type="submit" className="btn btn-success me-2">Guardar Venta</button> */}
                                    <button type="button" className="btn btn-primary" onClick={() => { handleSaveSale({ preventDefault: () => {} }); }}>Guardar e Imprimir</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Rental Modal */}
            {rentalModalOpen && (
                <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1080 }}></div>
            )}
            {rentalModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1090 }}>
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSaveRental}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Alquilar Vehículo: {selectedRentalVehicle?.marca} {selectedRentalVehicle?.modelo}</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeRentalModal}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Client Data Section */}
                                    <ClientInformation
                                        invoiceData={{
                                            clientName: rentalForm.cliente_nombre || '',
                                            clientEmail: rentalForm.cliente_email || '',
                                            clientPhone: rentalForm.cliente_telefono || '',
                                            clientAddress: rentalForm.cliente_direccion || ''
                                        }}
                                        setInvoiceData={(updatedData) => {
                                            handleRentalChange({ target: { name: 'cliente_nombre', value: updatedData.clientName || '' } })
                                            handleRentalChange({ target: { name: 'cliente_email', value: updatedData.clientEmail || '' } })
                                            handleRentalChange({ target: { name: 'cliente_telefono', value: updatedData.clientPhone || '' } })
                                            handleRentalChange({ target: { name: 'cliente_direccion', value: updatedData.clientAddress || '' } })
                                        }}
                                    />

                                    {/* Rental Information Section */}
                                    <div className="mb-4">
                                        <h6 className="text-primary mb-3">Información del Alquiler</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Fecha de Inicio *</label>
                                                <input
                                                    type="date"
                                                    name="fecha_inicio"
                                                    value={rentalForm.fecha_inicio || ''}
                                                    onChange={handleRentalChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Precio de Alquiler *</label>
                                                <input
                                                    type="number"
                                                    name="precio_alquiler"
                                                    value={rentalForm.precio_alquiler || ''}
                                                    onChange={handleRentalChange}
                                                    className="form-control"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Information Summary */}
                                    <div className="mb-4">
                                        <h6 className="text-primary mb-3">Información del Vehículo</h6>
                                        <div className="border p-3 rounded">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <strong>Marca:</strong> {selectedRentalVehicle?.marca}
                                                </div>
                                                <div className="col-md-3">
                                                    <strong>Modelo:</strong> {selectedRentalVehicle?.modelo}
                                                </div>
                                                <div className="col-md-3">
                                                    <strong>Año:</strong> {selectedRentalVehicle?.anio}
                                                </div>
                                                <div className="col-md-3">
                                                    <strong>Placa:</strong> {selectedRentalVehicle?.numero_placa}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeRentalModal}>Cancelar</button>
                                    <button type="submit" className="btn btn-warning">Guardar Alquiler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Vehiculos
