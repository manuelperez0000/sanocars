import { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import request from '../../utils/request'
import { apiurl } from '../../utils/globals'

const Usuarios = () => {
    const { users, loading, error, restoreUser, deleteUser, updateUser } = useUsers()

        const [modalOpen, setModalOpen] = useState(false)
        const [editingUser, setEditingUser] = useState(null)
        const [formData, setFormData] = useState({
            name: '',
            lastname: '',
            gender: '',
            email: '',
            mobile_no: '',
            role: ''
        })
        const [saving, setSaving] = useState(false)

    const handleRestoreUser = async (userId) => {
        if (window.confirm('¿Está seguro de que desea reestablecer este usuario?')) {
            try {
                await restoreUser(userId)
                // The hook should handle refreshing the users list
            } catch (error) {
                alert('Error al reestablecer el usuario: ' + error.message)
            }
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
            try {
                await deleteUser(userId)
                // The hook should handle refreshing the users list
            } catch (error) {
                alert('Error al eliminar el usuario: ' + error.message)
            }
        }
    }

    const [loadingUser, setLoadingUser] = useState(false)

    const openEditModal = async (user) => {
        // fetch latest user data from backend to ensure fields are up-to-date
        setLoadingUser(true)
        setModalOpen(true)
        try {
            const resp = await request.get(`${apiurl}/users/${user.id}`)
            const fetched = resp?.data?.data || resp?.data || user
            setFormData({
                name: fetched.name || '',
                lastname: fetched.lastname || '',
                gender: fetched.gender !== undefined && fetched.gender !== null ? String(fetched.gender) : '',
                email: fetched.email || '',
                mobile_no: fetched.mobile_no || '',
                role: fetched.role || ''
            })
            setEditingUser(fetched)
        } catch (err) {
            // fallback to provided user object if request fails
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                gender: user.gender !== undefined && user.gender !== null ? String(user.gender) : '',
                email: user.email || '',
                mobile_no: user.mobile_no || '',
                role: user.role || ''
            })
            setEditingUser(user)
            console.error('Error fetching user detail:', err)
            alert('No se pudo cargar la información más reciente del usuario. Mostrando datos locales.')
        } finally {
            setLoadingUser(false)
        }
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditingUser(null)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!editingUser) return
        setSaving(true)
        try {
            // prepare payload: convert gender to number if present
            const payload = {
                name: formData.name,
                lastname: formData.lastname,
                gender: formData.gender === '' ? null : Number(formData.gender),
                email: formData.email,
                mobile_no: formData.mobile_no,
                role: formData.role
            }
            await updateUser(editingUser.id, payload)
            closeModal()
        } catch (err) {
            alert('Error actualizando usuario: ' + (err.message || err))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Gestión de Usuarios</h2>
                    <div className="card">
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p className="mt-2">Cargando usuarios...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">
                                    <strong>Error:</strong> {error}
                                </div>
                            ) : (
                                <div>
                                    <h5 className="mb-3">Lista de Usuarios ({users.length})</h5>
                                    {users.length > 0 ? (
                                        <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 30px)', overflowY: 'auto' }}>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Nombre</th>
                                                        <th>Apellido</th>
                                                        <th>Género</th>
                                                        <th>Email</th>
                                                        <th>Teléfono</th>
                                                        <th>Rol</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user) => (
                                                        <tr key={user.id} className={user.soft_delete === 0 ? 'table-danger' : ''}>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.id}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.name || 'Sin nombre'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.lastname || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.gender === 1 ? 'Femenino' : user.gender === 0 ? 'Masculino' : '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.email || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.mobile_no || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.role || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.soft_delete === 0 ? 'Eliminado' : 'Activo'}</td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <button className="btn btn-sm btn-primary" onClick={() => openEditModal(user)}>Editar</button>
                                                                    {user.soft_delete === 1 && (
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => handleDeleteUser(user.id)}
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    )}
                                                                    {user.soft_delete === 0 && (
                                                                        <button
                                                                            className="btn btn-sm btn-success"
                                                                            onClick={() => handleRestoreUser(user.id)}
                                                                        >
                                                                            Reestablecer
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p>No hay usuarios registrados.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {modalOpen && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar usuario #{editingUser?.id}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {loadingUser ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <p className="mt-2">Cargando datos del usuario...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-2">
                                            <label className="form-label">Nombre</label>
                                            <input name="name" value={formData.name} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Apellido</label>
                                            <input name="lastname" value={formData.lastname} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Género</label>
                                            <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                                                <option value="">-- Seleccione --</option>
                                                <option value="0">Masculino</option>
                                                <option value="1">Femenino</option>
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Email</label>
                                            <input name="email" value={formData.email} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Teléfono</label>
                                            <input name="mobile_no" value={formData.mobile_no} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Rol</label>
                                            <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                                                <option value="">-- Seleccione rol --</option>
                                                <option value="employe">employe</option>
                                                <option value="Customer">Customer</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Usuarios
