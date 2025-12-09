import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import request from '../../utils/request'
import { apiurl, formatCurrency, topurl } from '../../utils/globals'
import useConfiguracion from '../../hooks/useConfiguracion'

const FinancingDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getPhones, getEmails } = useConfiguracion()
    const [financiamiento, setFinanciamiento] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const printStyles = `
@media print {
    body * {
        visibility: hidden;
    }
    .invoice-container, .invoice-container * {
        visibility: visible;
    }
    .invoice-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        font-size: 12px;
        line-height: 1.2;
    }
    .no-print {
        display: none !important;
    }
    .card {
        margin-bottom: 8px !important;
        border: 1px solid #dee2e6 !important;
    }
    .card-header {
        padding: 4px 8px !important;
        background-color: #f8f9fa !important;
        border-bottom: 1px solid #dee2e6 !important;
    }
    .card-body {
        padding: 6px 8px !important;
    }
    .mb-4 {
        margin-bottom: 8px !important;
    }
    .mb-2 {
        margin-bottom: 4px !important;
    }
    .mb-1 {
        margin-bottom: 2px !important;
    }
    .mt-2 {
        margin-top: 4px !important;
    }
    .py-2 {
        padding-top: 4px !important;
        padding-bottom: 4px !important;
    }
    .row {
        margin-left: -2px !important;
        margin-right: -2px !important;
    }
    .col-lg-4, .col-lg-12, .col-md-6, .col-12, .col-6 {
        padding-left: 2px !important;
        padding-right: 2px !important;
    }
    small {
        font-size: 11px !important;
    }
    h4 {
        font-size: 16px !important;
        margin-bottom: 4px !important;
    }
    h5 {
        font-size: 14px !important;
        margin-bottom: 2px !important;
    }
    h6 {
        font-size: 13px !important;
        margin-bottom: 2px !important;
    }
    p {
        margin-bottom: 2px !important;
    }
    @page {
        margin: 0.5cm;
        size: A4;
    }
}
`

    useEffect(() => {
        const style = document.createElement('style')
        style.textContent = printStyles
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

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
        return new Date(dateString).toLocaleDateString('es-VE')
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

    const renderFinancingImages = (financiamiento) => {
        const images = [
            { filename: financiamiento.seiru_cado_frontal, label: 'Seiru Frontal' },
            { filename: financiamiento.seiru_cado_trasero, label: 'Seiru Trasero' },
            { filename: financiamiento.licencia_conducir_frontal, label: 'Licencia Frontal' },
            { filename: financiamiento.licencia_conducir_trasero, label: 'Licencia Trasera' },
            { filename: financiamiento.kokumin_shakai_hoken, label: 'Kokumin Hoken' },
            { filename: financiamiento.libreta_banco, label: 'Libreta Banco' }
        ].filter(img => img.filename)

        if (images.length === 0) return <span className="text-muted">Sin documentos</span>

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px',
                marginTop: '10px'
            }}>
                {images.map((img, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <img
                            src={`${topurl}/uploads/${img.filename}`}
                            alt={img.label}
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid #e0e0e0',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(`${topurl}/uploads/${img.filename}`, '_blank')}
                            title={img.label}
                        />
                        <small className="text-muted d-block" style={{ fontSize: '11px', lineHeight: '1.2', marginTop: '4px' }}>
                            {img.label}
                        </small>
                    </div>
                ))}
            </div>
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
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-success no-print"
                                onClick={() => window.print()}
                            >
                                🖨️ Imprimir
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/admin/financiamiento')}
                            >
                                ← Volver a la lista
                            </button>
                        </div>
                    </div>

                    <div className="invoice-container">
                        {/* Company Header */}
                        <div className="mb-4">
                            <div className="card-header bg-light">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4>Detalles del Financiamiento #{financiamiento.id}</h4>
                                        <p className="mb-1"><strong>Fecha:</strong> {formatDate(financiamiento.fecha_creacion)}</p>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <h5>SANOCARS</h5>
                                        <p className="mb-1">Dirección: Numazu Shizuoka, Japón</p>
                                        <p className="mb-1">Teléfono: {getPhones()?.length > 0 ? getPhones()[0].texto : 'N/A'}</p>
                                        <p className="mb-1">Email: {getEmails()?.length > 0 ? getEmails()[0] : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Información Personal */}
                            <div className="col-lg-12 mb-2">
                                <div className="card">
                                    <div className="card-header py-2">
                                        <h6 className="card-title mb-0">Información Personal</h6>
                                    </div>
                                    <div className="card-body py-2">
                                        <div className="row">
                                            <div className="col-2 mb-1">
                                                <strong>Nombre (Kanji):</strong><br />
                                                <small>{financiamiento.nombres_kanji} {financiamiento.apellidos_kanji}</small>
                                            </div>
                                            <div className="col-2 mb-1">
                                                <strong>Nombre (Katakana):</strong><br />
                                                <small>{financiamiento.nombres_katakana} {financiamiento.apellidos_katakana}</small>
                                            </div>
                                            <div className="col-2 mb-1">
                                                <strong>Fecha Nac.:</strong><br />
                                                <small>{formatDate(financiamiento.fecha_nacimiento)}</small>
                                            </div>
                                            <div className="col-2 mb-1">
                                                <strong>Género:</strong><br />
                                                <small>{financiamiento.genero === "mujer" ? 'Femenino' : 'Masculino'}</small>
                                            </div>
                                            <div className="col-2 mb-1">
                                                <strong>Tel. Móvil:</strong><br />
                                                <small>{financiamiento.telefono_movil}</small>
                                            </div>
                                            <div className="col-2 mb-1">
                                                <strong>Tel. Casa:</strong><br />
                                                <small>{financiamiento.telefono_casa || 'N/A'}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información Residencial */}
                            <div className="col-12">
                                <div className="card mb-2">
                                    <div className="card-header py-2">
                                        <h6 className="card-title mb-0">Información Residencial</h6>
                                    </div>
                                    <div className="card-body py-2">
                                        <div className="row">
                                            <div className="col-3">
                                                <strong>Dirección:</strong><br />
                                                <small>{financiamiento.direccion_actual}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Personas:</strong><br />
                                                <small>{financiamiento.personas_viviendo}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Tiempo:</strong><br />
                                                <small>{financiamiento.tiempo_direccion}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Cabeza Fam.:</strong><br />
                                                <small>{financiamiento.cabeza_familia}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Pago Hip/Alq:</strong><br />
                                                <small>{financiamiento.pago_hipoteca_alquiler}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Hijos:</strong><br />
                                                <small>{financiamiento.cantidad_hijos}</small>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Información Laboral */}
                            <div className="col-12 mb-2">
                                <div className="card">
                                    <div className="card-header py-2">
                                        <h6 className="card-title mb-0">Información Laboral</h6>
                                    </div>
                                    <div className="card-body py-2">
                                        <div className="row">
                                            <div className="col-3 mb-1">
                                                <strong>Empresa (Kanji):</strong><br />
                                                <small>{financiamiento.nombre_empresa_kanji}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Empresa (Katakana):</strong><br />
                                                <small>{financiamiento.nombre_empresa_katakana}</small>
                                            </div>
                                            <div className="col-3 mb-2">
                                                <strong>Dirección Trabajo:</strong><br />
                                                <small>{financiamiento.direccion_trabajo}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Tel. Trabajo:</strong><br />
                                                <small>{financiamiento.telefono_trabajo}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Industria:</strong><br />
                                                <small>{financiamiento.tipo_industria}</small>
                                            </div>
                                     
                                            <div className="col-3 mb-1">
                                                <strong>Tiempo Trab.:</strong><br />
                                                <small>{financiamiento.tiempo_trabajando}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Día Pago:</strong><br />
                                                <small>{financiamiento.dia_pago}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Ingreso Mensual:</strong><br />
                                                <small>{formatCurrency(financiamiento.ingreso_mensual,'¥ ')}</small>
                                            </div>
                                            <div className="col-3 mb-1">
                                                <strong>Ingreso Anual:</strong><br />
                                                <small>{formatCurrency(financiamiento.ingreso_anual,'¥ ')}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estado y Documentos */}
                            <div className="col-lg-12 mt-2">
                                <div className="card">
                                    <div className="card-header py-2">
                                        <h6 className="card-title mb-0">Estado y Documentos</h6>
                                    </div>
                                    <div className="card-body py-2">
                                        <div className="row">
                                            <div className="col-md-6 mb-1">
                                                <strong>Estado:</strong> {getStatusBadge(financiamiento.status)}
                                            </div>
                                            <div className="col-md-6 mb-1">
                                                <strong>Fecha de Creación:</strong> {formatDate(financiamiento.fecha_creacion)}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <strong>Documentos Subidos:</strong>
                                            {renderFinancingImages(financiamiento)}
                                        </div>
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
