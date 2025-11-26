import { useState } from "react"

const ClientInformation = ({
    invoiceData,
    setInvoiceData,
    userSearch,
    handleUserSearch,
    filteredUsers,
    showUserDropdown,
    selectUser
}) => {

    const [clientType, setClientType] = useState()

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h6 className="mb-0">Información del Cliente</h6>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Tipo de Cliente</label>
                    <select
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="nuevo">Cliente Nuevo</option>
                        <option value="registrado">Cliente Registrado</option>
                    </select>
                </div>

                {/* User Search */}
                {clientType === 'registrado' && (
                    <div className="mb-3">
                        <label className="form-label">Buscar Cliente Registrado</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={userSearch}
                            onChange={(e) => handleUserSearch(e.target.value)}
                        />
                        {showUserDropdown && filteredUsers.length > 0 && (
                            <div className="mt-2 border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className="p-2 border-bottom cursor-pointer"
                                        onClick={() => selectUser(user)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div><strong>{user.name}</strong></div>
                                        <div className="small text-muted">{user.email} - {user.mobile_no}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Nombre <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={invoiceData.clientName}
                            onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={invoiceData.clientEmail}
                            onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            className="form-control"
                            value={invoiceData.clientPhone}
                            onChange={(e) => setInvoiceData({ ...invoiceData, clientPhone: e.target.value })}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            value={invoiceData.clientAddress}
                            onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientInformation
