import useUsers from '../../hooks/useUsers'

const Usuarios = () => {
    const {
        users, filteredUsers, filter, setFilter, loading, error, modalOpen, openEditModal, openNewModal,
        closeModal, editingUser, formData, handleChange, handleSave, handleCreate,
        loadingUser, saving, handleRestoreUser, handleDeleteUser
    } = useUsers()

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h2 className="mb-0">Gestión de Usuarios</h2>
                        <button className="btn btn-primary" onClick={() => openNewModal()}>
                            <span className="me-2">+</span> Nuevo usuario
                        </button>
                    </div>
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
                                    {/* Filter */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Lista de Usuarios ({filteredUsers.length} de {users.length})</h5>
                                        <div className="d-flex align-items-center gap-2">
                                            <label className="form-label mb-0">Filtrar por rol:</label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                style={{ width: 'auto' }}
                                            >
                                                <option value="todos">Todos</option>
                                                <option value="Customer">Clientes</option>
                                                <option value="employe">Empleados</option>
                                            </select>
                                        </div>
                                    </div>
                                    {users.length > 0 ? (
                                        <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 30px)', overflowY: 'auto' }}>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Nombre</th>
                                                        <th>Apellido</th>
                                                        <th>Nacionalidad</th>
                                                        <th>Email</th>
                                                        <th>Teléfono</th>
                                                        <th>Rol</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredUsers.map((user) => (
                                                        <tr key={user.id} className={user.soft_delete === 0 ? 'table-danger' : ''}>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.id}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.name || 'Sin nombre'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.lastname || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.nationality || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.email || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.mobile_no || '-'}</td>
                                                            <td style={user.soft_delete === 0 ? { color: 'red' } : {}}>{user.role || '-'}</td>

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
                                <h5 className="modal-title">{editingUser ? `Editar usuario #${editingUser.id}` : 'Nuevo usuario'}</h5>
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
                                            <label className="form-label">Direccion</label>
                                            <input name="address" value={formData.address} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Nacionalidad</label>
                                            <input name="nationality" value={formData.nationality} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Email</label>
                                            <input name="email" value={formData.email} onChange={handleChange} className="form-control" />
                                        </div>
                                        {!editingUser && (
                                            <div className="mb-2">
                                                <label className="form-label">Password</label>
                                                <input name="password" type="password" value={formData.password} onChange={handleChange} className="form-control" />
                                            </div>
                                        )}
                                        <div className="mb-2">
                                            <label className="form-label">Teléfono</label>
                                            <input name="mobile_no" value={formData.mobile_no} onChange={handleChange} className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Rol</label>
                                            <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                                                <option value="">-- Seleccione rol --</option>
                                                <option selected value="Customer">Cliente</option>
                                                <option value="employe">Empleado</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                                {editingUser ? (
                                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={async () => { try { await handleCreate(); } catch (err) { alert('Error creando usuario: ' + (err?.response?.data?.message || err)) } }} disabled={saving}>{saving ? 'Guardando...' : 'Crear usuario'}</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Usuarios
