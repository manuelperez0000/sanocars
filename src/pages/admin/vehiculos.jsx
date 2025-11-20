import useVehicles from '../../hooks/useVehicles'
import { hostUrl } from '../../utils/globals'

const Vehiculos = () => {
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
        visibleVehicles,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleMarkAsSold,
        handleMarkAsDeleted,
        getImages
    } = useVehicles()

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Gestión de Vehículos</h2>
                        <div>
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
                                                            <td>{v.status}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-info me-2" onClick={() => openEdit(v)}>Editar</button>
                                                                <button className="btn btn-sm btn-success me-2" onClick={() => handleMarkAsSold(v)}>Vendido</button>
                                                                <button className="btn btn-sm btn-danger" onClick={() => handleMarkAsDeleted(v)}>Eliminar</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={9} className="text-center p-4">No hay vehículos</td>
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
                                            <label className="form-label">Tamaño motor</label>
                                            <input name="tamano_motor" value={form.tamano_motor || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Trabajos a realizar</label>
                                            <textarea name="trabajos_realizar" value={form.trabajos_realizar || ''} onChange={handleChange} className="form-control" rows="2"></textarea>
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
                                                                src={`${hostUrl}/uploads/${imagen}`}
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
        </div>
    )
}

export default Vehiculos
