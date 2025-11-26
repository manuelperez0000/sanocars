import React, { useState } from 'react'
import useFacturas from '../../hooks/useFacturas'
import { Link } from 'react-router-dom'

const Facturas = () => {
    const { facturas, loading, error, deleteFactura } = useFacturas()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleDeleteFactura = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta factura?')) return
        try {
            await deleteFactura(id)
        } catch (err) {
            alert('Error eliminando factura: ' + err?.response?.data?.message)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES'
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-VE')
    }

    // Filter invoices based on date range
    const filteredFacturas = facturas.filter(factura => {
        const invoiceDate = new Date(factura.fecha_creacion)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        const afterStart = !start || invoiceDate >= start
        const beforeEnd = !end || invoiceDate <= end

        return afterStart && beforeEnd
    })

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
                    <div className='flex-between align-items-center mb-2'>
                        <div className="d-flex align-items-center gap-3">
                            <h2 className="">Facturas</h2>
                            <Link to="/admin/facturacion" className="btn btn-secondary">
                                {"<-"} Regresar
                            </Link>
                        </div>
                        <div className="flex-center">
                            <div className="">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className=" d-flex align-items-end">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setStartDate('')
                                        setEndDate('')
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    {filteredFacturas.length === 0 ? (
                        <div className="alert alert-info">
                            {facturas.length === 0 ? 'No hay facturas registradas' : 'No hay facturas en el rango de fechas seleccionado'}
                        </div>
                    ) : (
                        <div className="card">

                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Item</th>
                                                <th>Cliente</th>
                                                <th>Total</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFacturas.map(factura => (
                                                <tr key={factura.id}>
                                                    <td>{factura.id}</td>
                                                    <td>{JSON.parse(factura.items).length > 0 ? JSON.parse(factura.items)[0].name : 'N/A'} </td>
                                                    <td>
                                                        {factura.cliente_nombre}
                                                        {factura.cliente_apellido && ` ${factura.cliente_apellido}`}
                                                    </td>
                                                    <td>{formatCurrency(factura.total)}</td>
                                                    <td>{formatDate(factura.fecha_creacion)}</td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/factura/${factura.id}`}
                                                            className="btn btn-sm btn-info me-2"
                                                        >
                                                            Ver
                                                        </Link>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteFactura(factura.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}

export default Facturas
