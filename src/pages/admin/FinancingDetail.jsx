import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import request from '../../utils/request'
import { apiurl } from '../../utils/globals'

const FinancingDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [financiamiento, setFinanciamiento] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchFinanciamientoDetail()
    }, [id])

    const fetchFinanciamientoDetail = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await request.get(apiurl + `/financing/${id}`)
            setFinanciamiento(response.data.body)
        } catch (error) {
            console.error('Error fetching financiamiento detail:', error)
            setError('Error al cargar los detalles del financiamiento')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES')
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'JPY'
        }).format(amount)
    }

    const getStatusBadge = (status) => {
        const statusColors = {
            'pendiente': 'warning',
            'cancelado': 'danger',
            'en tramite': 'info',
            'realizado': 'success'
        }
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
                        <h2 className="mb-4">Detalles del Financiamiento</h2>
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

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4">Detalles del Financiamiento</h2>
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/financiamiento')}
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!financiamiento) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4">Detalles del Financiamiento</h2>
                        <div className="alert alert-warning" role="alert">
                            Financiamiento no encontrado
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/financiamiento')}
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Detalles del Financiamiento #{financiamiento.id}</h2>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/financiamiento')}
                        >
                            ← Volver a la lista
                        </button>
                    </div>

                    <div className="row">
                        {/* Información Personal */}
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Información Personal</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Nombre (Kanji):</strong><br />
                                            {financiamiento.nombres_kanji} {financiamiento.apellidos_kanji}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Nombre (Katakana):</strong><br />
                                            {financiamiento.nombres_katakana} {financiamiento.apellidos_katakana}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Fecha de Nacimiento:</strong><br />
                                            {formatDate(financiamiento.fecha_nacimiento)}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Género:</strong><br />
                                            {financiamiento.genero}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Teléfono Móvil:</strong><br />
                                            {financiamiento.telefono_movil}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Teléfono Casa:</strong><br />
                                            {financiamiento.telefono_casa || 'No especificado'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información Residencial */}
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Información Residencial</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <strong>Dirección Actual:</strong><br />
                                        {financiamiento.direccion_actual}
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Personas Viviendo:</strong><br />
                                            {financiamiento.personas_viviendo}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Tiempo en Dirección:</strong><br />
                                            {financiamiento.tiempo_direccion}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Cabeza de Familia:</strong><br />
                                            {financiamiento.cabeza_familia}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Pago Hipoteca/Alquiler:</strong><br />
                                            {financiamiento.pago_hipoteca_alquiler}
                                        </div>
                                    </div>
                                    {financiamiento.cantidad_hijos > 0 && (
                                        <>
                                            <hr />
                                            <div className="mb-3">
                                                <strong>Cantidad de Hijos:</strong><br />
                                                {financiamiento.cantidad_hijos}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Información Laboral */}
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Información Laboral</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Empresa (Kanji):</strong><br />
                                            {financiamiento.nombre_empresa_kanji}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Empresa (Katakana):</strong><br />
                                            {financiamiento.nombre_empresa_katakana}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="mb-3">
                                        <strong>Dirección del Trabajo:</strong><br />
                                        {financiamiento.direccion_trabajo}
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Teléfono Trabajo:</strong><br />
                                            {financiamiento.telefono_trabajo}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Tipo de Industria:</strong><br />
                                            {financiamiento.tipo_industria}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Tiempo Trabajando:</strong><br />
                                            {financiamiento.tiempo_trabajando}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Día de Pago:</strong><br />
                                            {financiamiento.dia_pago}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Ingreso Mensual:</strong><br />
                                            {formatCurrency(financiamiento.ingreso_mensual)}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Ingreso Anual:</strong><br />
                                            {formatCurrency(financiamiento.ingreso_anual)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estado y Documentos */}
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Estado y Documentos</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <strong>Estado:</strong><br />
                                            {getStatusBadge(financiamiento.status)}
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Fecha de Creación:</strong><br />
                                            {formatDate(financiamiento.fecha_creacion)}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="mb-3">
                                        <strong>Documentos Subidos:</strong>
                                        <ul className="list-unstyled mt-2">
                                            <li>✓ Seiru Card (Frontal)</li>
                                            <li>✓ Seiru Card (Trasera)</li>
                                            <li>✓ Licencia de Conducir (Frontal)</li>
                                            <li>✓ Licencia de Conducir (Trasera)</li>
                                            <li>✓ Kokumin Shakai Hoken</li>
                                            <li>✓ Libreta de Banco</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinancingDetail
