import { useState } from 'react'
import useCategoriasServicio from '../../hooks/useCategoriasServicio'
import request from '../../utils/request'
import { hostUrl } from '../../utils/globals'
import imageCompression from 'browser-image-compression'
import CategoryCard from './CategoryCard'

const CategoriasServicio = () => {
    const { categorias, loading, error, createCategoria, updateCategoria, deleteCategoria } = useCategoriasServicio()

    const [modalOpen, setModalOpen] = useState(false)
    const [editingCategoria, setEditingCategoria] = useState(null)
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imageUploadError, setImageUploadError] = useState('')

    const [formData, setFormData] = useState({
        titulo: '',
        imagen: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true
        }
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    }

    const handleImageChange = async (file) => {
        if (!file) return

        setImageUploadError('')
        setUploadingImage(true)

        try {
            const compressedFile = await compressImage(file)
            const newFile = new File([compressedFile], file.name, { type: compressedFile.type })

            const formDataUpload = new FormData()
            formDataUpload.append('image', newFile)

            const response = await request.post(hostUrl + '/upload', formDataUpload)
            const fileName = response.data.filename

            setFormData(prev => ({
                ...prev,
                imagen: fileName
            }))
        } catch (error) {
            console.error('Error uploading image:', error)
            setImageUploadError('No se pudo cargar la imagen. Inténtalo de nuevo.')
        } finally {
            setUploadingImage(false)
        }
    }

    const openModal = (categoria = null) => {
        if (categoria) {
            setEditingCategoria(categoria)
            setFormData({
                titulo: categoria.titulo,
                imagen: categoria.imagen
            })
        } else {
            setEditingCategoria(null)
            setFormData({
                titulo: '',
                imagen: ''
            })
        }
        setModalOpen(true)
        setImageUploadError('')
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditingCategoria(null)
        setFormData({
            titulo: '',
            imagen: ''
        })
        setImageUploadError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.titulo || !formData.imagen) {
            alert('Por favor complete todos los campos')
            return
        }

        setSaving(true)
        try {
            if (editingCategoria) {
                await updateCategoria(editingCategoria.id, formData)
                alert('Categoría actualizada exitosamente')
            } else {
                await createCategoria(formData)
                alert('Categoría creada exitosamente')
            }
            closeModal()
        } catch (error) {
            console.error('Error saving category:', error)
            alert('Error al guardar la categoría: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

        try {
            await deleteCategoria(id)
            alert('Categoría eliminada exitosamente')
        } catch (error) {
            console.error('Error deleting category:', error)
            alert('Error al eliminar la categoría: ' + error.message)
        }
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
                        <h2>Gestión de Categorías de Servicio</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => openModal()}
                        >
                            Nueva Categoría
                        </button>
                    </div>

                    {categorias.length === 0 ? (
                        <div className="alert alert-info">
                            No hay categorías registradas
                        </div>
                    ) : (
                        <div className="row">
                            {categorias.map(categoria => (
                                <CategoryCard
                                    key={categoria.id}
                                    categoria={categoria}
                                    onEdit={openModal}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Create/Edit Category */}
            {modalOpen && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Título *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="titulo"
                                                value={formData.titulo}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Imagen *</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e.target.files[0])}
                                                disabled={uploadingImage}
                                            />
                                            {uploadingImage && (
                                                <div className="mt-2">
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                    <span className="ms-2">Subiendo imagen...</span>
                                                </div>
                                            )}
                                            {imageUploadError && (
                                                <div className="text-danger mt-1">
                                                    {imageUploadError}
                                                </div>
                                            )}
                                            {formData.imagen && !uploadingImage && (
                                                <div className="mt-2">
                                                    <small className="text-success">Imagen subida: {formData.imagen}</small>
                                                    <div className="mt-2">
                                                        <img
                                                            src={`${hostUrl}/uploads/${formData.imagen}`}
                                                            alt="Preview"
                                                            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModal}
                                            disabled={saving}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving || uploadingImage}
                                        >
                                            {saving ? 'Guardando...' : (editingCategoria ? 'Actualizar' : 'Crear')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default CategoriasServicio
