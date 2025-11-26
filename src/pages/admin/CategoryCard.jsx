import { useState } from 'react'
import useItemsServicio from '../../hooks/useItemsServicio'
import {  topurl } from '../../utils/globals'
import {FaTrashAlt} from 'react-icons/fa'

const CategoryCard = ({ categoria, onEdit, onDelete }) => {
    const { items, loading: itemsLoading, createItem, deleteItem } = useItemsServicio(categoria.id)
    const [itemsModalOpen, setItemsModalOpen] = useState(false)
    const [itemFormData, setItemFormData] = useState({ titulo: '' })
    const [savingItem, setSavingItem] = useState(false)

    const handleItemChange = (e) => {
        const { name, value } = e.target
        setItemFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleItemSubmit = async (e) => {
        e.preventDefault()

        if (!itemFormData.titulo) {
            alert('Por favor ingrese el título del item')
            return
        }

        setSavingItem(true)
        try {
            await createItem(itemFormData)
            alert('Item agregado exitosamente')
            setItemFormData({ titulo: '' })
        } catch (error) {
            console.error('Error saving item:', error)
            alert('Error al guardar el item: ' + error.message)
        } finally {
            setSavingItem(false)
        }
    }

    const handleDeleteItem = async (itemId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este item?')) return

        try {
            await deleteItem(itemId)
            alert('Item eliminado exitosamente')
        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Error al eliminar el item: ' + error.message)
        }
    }

    return (
        <>
            <div className="col-md-4 mb-4">
                <div className="card h-100">
                    <div className="card-img-top" style={{ height: '200px', overflow: 'hidden' }}>
                        <img
                            src={`${topurl}/uploads/${categoria.imagen}`}
                            alt={categoria.titulo}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{categoria.titulo}</h5>

                        {/* Items list */}
                        <div className="mb-3">
                            <strong>Items:</strong>
                            {itemsLoading ? (
                                <div className="text-center mt-2">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : items.length === 0 ? (
                                <p className="text-muted small mt-1">No hay items</p>
                            ) : (
                                <ul className="list-group list-group-flush mt-2">
                                    {items.map(item => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span className="small">{item.titulo}</span>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-auto">
                            <button
                                className="btn btn-sm btn-success me-2 mb-2"
                                onClick={() => setItemsModalOpen(true)}
                            >
                                Items
                            </button>
                            <button
                                className="btn btn-sm btn-primary me-2 mb-2"
                                onClick={() => onEdit(categoria)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-sm btn-danger mb-2"
                                onClick={() => onDelete(categoria.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for adding items */}
            {itemsModalOpen && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Agregar Item - {categoria.titulo}</h5>
                                    <button type="button" className="btn-close" onClick={() => setItemsModalOpen(false)}></button>
                                </div>
                                <form onSubmit={handleItemSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Título del Item *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="titulo"
                                                value={itemFormData.titulo}
                                                onChange={handleItemChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setItemsModalOpen(false)}
                                            disabled={savingItem}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={savingItem}
                                        >
                                            {savingItem ? 'Agregando...' : 'Agregar Item'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default CategoryCard
