

import useInspeccionVehicular from '../../hooks/useInspeccionVehicular'
import { hostUrl } from '../../utils/globals'

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
        clientes,
        searchingClients,
        searchClients,
        selectClient
    } = useInspeccionVehicular()

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
                                                <th>Neumáticos (%)</th>
                                                <th>Fecha Creación</th>
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
                                                        <td>{inspeccion.vehiculo_neumaticos}%</td>
                                                        <td>{new Date(inspeccion.fecha_creacion).toLocaleDateString()}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info me-2" onClick={() => openEdit(inspeccion)}>Editar</button>
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
                                        <div className="col-md-4 mb-4">
                                            <div className="card h-100">
                                                <div className="card-header">
                                                    <h6 className="mb-0">Información del Cliente</h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="mb-3">
                                                        <label className="form-label">Tipo de Cliente</label>
                                                        <select
                                                            name="cliente_tipo"
                                                            value={form.cliente_tipo}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        >
                                                            <option value="nuevo">Cliente Nuevo</option>
                                                            <option value="registrado">Cliente Registrado</option>
                                                        </select>
                                                    </div>

                                                    {form.cliente_tipo === 'registrado' && (
                                                        <div className="mb-3">
                                                            <label className="form-label">Buscar Cliente</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Buscar por nombre o email..."
                                                                onChange={(e) => searchClients(e.target.value)}
                                                            />
                                                            {searchingClients && <div className="mt-2">Buscando...</div>}
                                                            {clientes.length > 0 && (
                                                                <div className="mt-2 border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                                    {clientes.map(client => (
                                                                        <div
                                                                            key={client.id}
                                                                            className="p-2 border-bottom cursor-pointer"
                                                                            onClick={() => selectClient(client)}
                                                                            style={{ cursor: 'pointer' }}
                                                                        >
                                                                            <div><strong>{client.nombre}</strong></div>
                                                                            <div className="small text-muted">{client.email}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mb-3">
                                                        <label className="form-label">Nombre</label>
                                                        <input
                                                            name="cliente_nombre"
                                                            value={form.cliente_nombre}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Email</label>
                                                        <input
                                                            name="cliente_email"
                                                            type="email"
                                                            value={form.cliente_email}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Teléfono</label>
                                                        <input
                                                            name="cliente_telefono"
                                                            value={form.cliente_telefono}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Dirección</label>
                                                        <textarea
                                                            name="cliente_direccion"
                                                            value={form.cliente_direccion}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            rows="2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 2: Información del Vehículo */}
                                        <div className="col-md-4 mb-4">
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
                                                            <label className="form-label">Neumáticos (%)</label>
                                                            <input
                                                                name="vehiculo_neumaticos"
                                                                type="number"
                                                                min="1"
                                                                max="100"
                                                                value={form.vehiculo_neumaticos}
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                required
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
                                                        <label className="form-label">Detalles de Pintura</label>
                                                        <textarea name="vehiculo_detalles_pintura" value={form.vehiculo_detalles_pintura} onChange={handleChange} className="form-control" rows="2" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Trabajos a realizar</label>
                                                        <textarea name="vehiculo_observaciones" value={form.vehiculo_observaciones} onChange={handleChange} className="form-control" rows="3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 3: Fotos */}
                                        <div className="col-md-4 mb-4">
                                            <div className="card h-100">
                                                <div className="card-header">
                                                    <h6 className="mb-0">Fotos</h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="mb-3">
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
                                                                    src={`${hostUrl}/uploads/${form.foto_vehiculo}`}
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

                                                    <div className="mb-3">
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
                                                                    src={`${hostUrl}/uploads/${form.foto_documento}`}
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
