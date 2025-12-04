import useInventory from '../../hooks/useInventory'
import { formatCurrency, topurl } from '../../utils/globals'

const Inventario = () => {
    const {
        loading,
        error,
        modalOpen,
        setModalOpen,
        editing,
        form,
        uploadingImages,
        imageUploadErrors,
        visibleInventory,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleDelete,
        getImages
    } = useInventory()

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Gestión de Inventario</h2>
                        <div>
                            <button className="btn btn-primary" onClick={openNew}>Agregar producto</button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="card">
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4">Cargando inventario...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Imágenes</th>
                                                <th>Nombre</th>
                                                <th>Fabricante</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                                <th>Detalle</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleInventory && visibleInventory.length > 0 ? (
                                                visibleInventory.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{getImages(item.imagenes)}</td>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.fabricante}</td>
                                                        <td>{item.precio ? `${formatCurrency(item.precio)}` : ''}</td>
                                                        <td>{item.cantidad || 0}</td>
                                                        <td>{item.detalle}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info me-2" onClick={() => openEdit(item)}>Editar</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>Eliminar</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center p-4">No hay productos en el inventario</td>
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
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editing ? 'Editar producto' : 'Nuevo producto'}</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input name="nombre" value={form.nombre || ''} onChange={handleChange} className="form-control" required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Fabricante</label>
                                            <input name="fabricante" value={form.fabricante || ''} onChange={handleChange} className="form-control" required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Precio en ¥</label>
                                            <input name="precio" type="number" step="1" value={form.precio || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cantidad</label>
                                            <input name="cantidad" type="number" min="0" value={form.cantidad || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Detalle</label>
                                            <input name="detalle" value={form.detalle || ''} onChange={handleChange} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row">
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
        </div>
    )
}

export default Inventario
