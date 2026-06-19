import { useState, useEffect, useMemo } from "react"
import request from "../utils/request"
import { apiurl } from "../utils/globals"
import useClientes from "../hooks/useClientes"

const ClientInformation = ({
    invoiceData,
    setInvoiceData
}) => {
 
    const [clientType, setClientType] = useState('nuevo')
    const [users, setUsers] = useState([])
    const [userSearch, setUserSearch] = useState('')
    const [filteredClients, setFilteredClients] = useState([])
    const [showClientDropdown, setShowClientDropdown] = useState(false)
    const { clientes } = useClientes()

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await request.get(apiurl + '/users')
                if (response.data.body) {
                    setUsers(response.data.body)
                }
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }

        fetchUsers()
    }, [])

    const mergedClients = useMemo(() => {
        const normalizedUsers = users.map(user => ({
            id: `user_${user.id}`,
            name: user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Cliente',
            email: user.email || '',
            phone: user.mobile_no || user.telefono || '',
            address: user.address || user.direccion || '',
            origin: 'usuario'
        }))

        const normalizedClientes = (clientes || []).map(cliente => ({
            id: `cliente_${cliente.id}`,
            name: cliente.nombre || `${cliente.nombre} ${cliente.apellido || ''}`.trim() || 'Cliente',
            email: cliente.email || '',
            phone: cliente.telefono || cliente.telefono_cliente || cliente.cliente_telefono || '',
            address: cliente.direccion || cliente.direccion_cliente || cliente.cliente_direccion || '',
            origin: cliente.tabla_origen || 'cliente'
        }))

        const combined = [...normalizedUsers, ...normalizedClientes]

        const uniqueByKey = new Map()
        combined.forEach(item => {
            const dedupeKey = `${item.email || item.phone || item.name}`.toLowerCase()
            if (!uniqueByKey.has(dedupeKey)) {
                uniqueByKey.set(dedupeKey, item)
            }
        })

        return Array.from(uniqueByKey.values())
    }, [users, clientes])

    // Filter clients based on search
    useEffect(() => {
        if (mergedClients.length > 0 && userSearch.trim()) {
            const query = userSearch.toLowerCase()
            const filtered = mergedClients.filter(client =>
                client.name?.toLowerCase().includes(query) ||
                client.email?.toLowerCase().includes(query) ||
                client.phone?.toLowerCase().includes(query)
            )
            setFilteredClients(filtered)
            setShowClientDropdown(filtered.length > 0)
        } else {
            setFilteredClients([])
            setShowClientDropdown(false)
        }
    }, [mergedClients, userSearch])

    const handleUserSearch = (value) => {
        setUserSearch(value)
    }

    const selectUser = (user) => {
        setInvoiceData({
            ...invoiceData,
            clientName: user.name || '',
            clientEmail: user.email || '',
            clientPhone: user.phone || '',
            clientAddress: user.address || ''
        })
        setUserSearch('')
        setShowClientDropdown(false)
    }

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
                        {showClientDropdown && filteredClients.length > 0 && (
                            <div className="mt-2 border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {filteredClients.map(client => (
                                    <div
                                        key={client.id}
                                        className="p-2 border-bottom"
                                        onClick={() => selectUser(client)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div><strong>{client.name}</strong></div>
                                        <div className="small text-muted">{client.email} - {client.phone}</div>
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
