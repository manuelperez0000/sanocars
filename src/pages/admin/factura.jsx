import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useFacturas from '../../hooks/useFacturas'
import { formatCurrency } from '../../utils/globals'
import HeaderFactura2 from '../../components/HeaderFactura2'
const Factura = () => {

    const { id } = useParams()
    const { facturas, loading, error } = useFacturas()
    const [factura, setFactura] = useState(null)

    useEffect(() => {
        if (facturas.length > 0) {
            const foundFactura = facturas.find(f => f.id === parseInt(id))
            setFactura(foundFactura)
        }
    }, [facturas, id])

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
    }
    .no-print {
        display: none !important;
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

    if (!factura) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-warning">
                    Factura no encontrada
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                           
                            <Link to="/admin/facturas" className="btn btn-secondary">
                                {"<-"} Regresar
                            </Link>
                        </div>
                        <div className="no-print">
                            <button
                                className="btn btn-success"
                                onClick={() => window.print()}
                            >
                                Imprimir
                            </button>
                        </div>
                    </div>

                    <div className="invoice-container card shadow p-5">
                        {/* Invoice Header */}
                        
                        <HeaderFactura2 id={factura.id} />
                        {/* Client Information */}
                        <div className="mb-2">
                            <div className="border-bottom pb-1 mb-1">
                                <h6>Información del Cliente</h6>
                            </div>
                            <div className="card-body container-fluid">
                                <div className="row">
                                    <div className="col-6 col-md-3">
                                        <p><strong>Nombre:</strong> <br /> {factura.cliente_nombre}</p>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <p><strong>Teléfono:</strong> <br /> {factura.cliente_telefono || 'N/A'}</p>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <p><strong>Email:</strong> <br /> {factura.cliente_email || 'N/A'}</p>
                                    </div>
                                    
                                    <div className="col-6 col-md-3">
                                        <p><strong>Dirección:</strong> <br /> {factura.cliente_direccion || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6>Items</h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {factura?.items && JSON.parse(factura.items).length > 0 && JSON.parse(factura.items).map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatCurrency(item.price,'¥ ')}</td>
                                                    <td>{formatCurrency(item.subtotal,'¥ ')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                <td className="fw-bold">{formatCurrency(factura.total)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Factura
