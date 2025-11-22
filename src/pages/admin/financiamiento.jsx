import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import request from '../../utils/request'
import { apiurl } from '../../utils/globals'
const Financiamiento = () => {
    const navigate = useNavigate()
    const [financiamientos, setFinanciamientos] = useState([])
    const [filteredFinanciamientos, setFilteredFinanciamientos] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('todos')
    const [updatingStatus, setUpdatingStatus] = useState(null)

    const statusOptions = [
        { value: 'todos', label: 'Todos' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'cancelado', label: 'Cancelado' },
        { value: 'en tramite', label: 'En Trámite' },
        { value: 'realizado', label: 'Realizado' }
    ]

    const statusColors = {
        'pendiente': 'warning',
        'cancelado': 'danger',
        'en tramite': 'info',
        'realizado': 'success'
    }

    useEffect(() => {
        fetchFinanciamientos()
    }, [])

    useEffect(() => {
        filterFinanciamientos()
    }, [financiamientos, filter])

    const fetchFinanciamientos = async () => {
        try {
            setLoading(true)
            const response = await request.get(apiurl + '/financing')
            setFinanciamientos(response.data.body)
        } catch (error) {
            console.error('Error fetching financiamientos:', error)
            alert('Error al cargar los financiamientos')
        } finally {
            setLoading(false)
        }
    }

    const filterFinanciamientos = () => {
        if (filter === 'todos') {
            setFilteredFinanciamientos(financiamientos)
        } else {
            setFilteredFinanciamientos(financiamientos.filter(f => f.status === filter))
        }
    }

    const updateStatus = async (id, newStatus) => {
        try {
            setUpdatingStatus(id)
            await request.put(apiurl + `/financing/${id}/status`, { status: newStatus })
            // Update local state
            setFinanciamientos(prev =>
                prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
            )
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Error al actualizar el estado')
        } finally {
            setUpdatingStatus(null)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES')
    }

    const getStatusBadge = (status) => {
        return (
            <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4">Gestión de Financiamiento</h2>
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className='flex-between'>
                        <h2 className="mb-4">Gestión de Financiamiento</h2>
                        <Link to="/financiamiento" className="btn btn-success mb-4">Nuevo Financiamiento</Link>
                    </div>

                    {/* Filter */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <label className="form-label">Filtrar por estado:</label>
                                    <select
                                        className="form-select"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-8 d-flex align-items-end">
                                    <small className="text-muted">
                                        Mostrando {filteredFinanciamientos.length} de {financiamientos.length} financiamientos
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="card">
                        <div className="card-body">
                            {filteredFinanciamientos.length === 0 ? (
                                <p className="text-center text-muted">No hay financiamientos para mostrar</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Teléfono</th>
                                                <th>Fecha Creación</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFinanciamientos.map(financiamiento => (
                                                <tr key={financiamiento.id}>
                                                    <td>{financiamiento.id}</td>
                                                    <td>
                                                        {financiamiento.nombres_kanji} {financiamiento.apellidos_kanji}
                                                        <br />
                                                        <small className="text-muted">
                                                            {financiamiento.nombres_katakana} {financiamiento.apellidos_katakana}
                                                        </small>
                                                    </td>
                                                    <td>{financiamiento.telefono_movil}</td>
                                                    <td>{formatDate(financiamiento.fecha_creacion)}</td>
                                                    <td>{getStatusBadge(financiamiento.status)}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => navigate(`/admin/financiamiento/${financiamiento.id}`)}
                                                            >
                                                                Ver Detalles
                                                            </button>
                                                            <div className="btn-group btn-group-sm" role="group">
                                                                {statusOptions.slice(1).map(statusOption => (
                                                                    <button
                                                                        key={statusOption.value}
                                                                        type="button"
                                                                        className={`btn btn-outline-${statusColors[statusOption.value]} ${financiamiento.status === statusOption.value ? 'active' : ''}`}
                                                                        onClick={() => updateStatus(financiamiento.id, statusOption.value)}
                                                                        disabled={updatingStatus === financiamiento.id}
                                                                    >
                                                                        {updatingStatus === financiamiento.id ? (
                                                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                                                        ) : (
                                                                            statusOption.label
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Financiamiento
