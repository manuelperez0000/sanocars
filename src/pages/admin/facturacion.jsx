import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useInventory from '../../hooks/useInventory'
import useFacturas from '../../hooks/useFacturas'

const Facturacion = () => {
    const navigate = useNavigate()
    const { inventory, loading: inventoryLoading } = useInventory()
    const { createFactura } = useFacturas()

    const [selectedItems, setSelectedItems] = useState([])
    const [invoiceData, setInvoiceData] = useState({
        clientName: '',
        clientLastName: '',
        clientGender: '',
        clientEmail: '',
        clientPhone: '',
        clientId: '',
        items: []
    })

    // Product search state
    const [productSearch, setProductSearch] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    // Filter products based on search
    useEffect(() => {
        if (inventory) {
            const filtered = inventory.filter(product =>
                product.nombre?.toLowerCase().includes(productSearch.toLowerCase()) ||
                product.fabricante?.toLowerCase().includes(productSearch.toLowerCase()) ||
                product.id?.toString().includes(productSearch)
            )
            setFilteredProducts(filtered)
        }
    }, [inventory, productSearch])

    const handleProductSelect = (product, quantity = 1) => {
        const item = {
            type: 'product',
            id: product.id,
            name: product.nombre,
            price: product.precio,
            quantity: quantity,
            subtotal: product.precio * quantity
        }
        setSelectedItems([...selectedItems, item])
    }

    const removeItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index))
    }

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.subtotal, 0)
    }

    const generateInvoice = async () => {
        try {
            // Validation
            if (!invoiceData.clientName.trim()) {
                alert('El nombre del cliente es requerido')
                return
            }

            if (selectedItems.length === 0) {
                alert('Debe agregar al menos un producto a la factura')
                return
            }

            const total = calculateTotal()

            // Prepare invoice data for database
            const invoiceDataForDB = {
                tipo: 'producto',
                cliente_nombre: invoiceData.clientName.trim(),
                cliente_apellido: invoiceData.clientLastName.trim() || null,
                cliente_genero: invoiceData.clientGender || null,
                cliente_email: invoiceData.clientEmail.trim() || null,
                cliente_telefono: invoiceData.clientPhone.trim() || null,
                cliente_cedula: invoiceData.clientId.trim() || null,
                items: selectedItems,
                total: total,
                datos_pago: null,
                cuotas: null
            }

            // Save to database
            const savedInvoice = await createFactura(invoiceDataForDB)

            // Prepare data for printing
            const invoice = {
                ...invoiceData,
                id: savedInvoice.id,
                items: selectedItems,
                total: total,
                date: new Date().toLocaleDateString()
            }

            // Print functionality
            const printWindow = window.open('', '_blank')
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Factura #${savedInvoice.id}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .client-info { margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            .total { font-weight: bold; font-size: 18px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>SANOCARS</h1>
                            <h2>Factura #${savedInvoice.id}</h2>
                        </div>
                        <div class="client-info">
                            <p><strong>Nombre:</strong> ${invoice.clientName || 'N/A'}</p>
                            <p><strong>Apellido:</strong> ${invoice.clientLastName || 'N/A'}</p>
                            <p><strong>Género:</strong> ${invoice.clientGender || 'N/A'}</p>
                            <p><strong>Email:</strong> ${invoice.clientEmail || 'N/A'}</p>
                            <p><strong>Teléfono:</strong> ${invoice.clientPhone || 'N/A'}</p>
                            <p><strong>Cédula:</strong> ${invoice.clientId || 'N/A'}</p>
                            <p><strong>Fecha:</strong> ${invoice.date}</p>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.price?.toLocaleString() || 0}</td>
                                        <td>$${item.subtotal?.toLocaleString() || 0}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="total">
                            <p>Total: $${invoice.total?.toLocaleString() || 0}</p>
                        </div>
                    </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.print()

            // Clear form after successful invoice generation
            setSelectedItems([])
            setInvoiceData({
                clientName: '',
                clientLastName: '',
                clientGender: '',
                clientEmail: '',
                clientPhone: '',
                clientId: '',
                items: []
            })

            alert('Factura generada exitosamente!')
        } catch (error) {
            console.error('Error generating invoice:', error)
            alert('Error al generar la factura: ' + error.message)
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Facturación</h2>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/admin/facturas')}
                        >
                            Ver Todas las Facturas
                        </button>
                    </div>

                    {/* Product Search */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Buscar Productos</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre, fabricante o ID..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                />
                            </div>
                            {inventoryLoading ? (
                                <div>Cargando productos...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Fabricante</th>
                                                <th>Precio</th>
                                                <th>Cantidad Disponible</th>
                                                <th>Cantidad a Facturar</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map(product => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td>{product.nombre}</td>
                                                    <td>{product.fabricante}</td>
                                                    <td>${product.precio?.toLocaleString() || 0}</td>
                                                    <td>{product.cantidad || 0}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={product.cantidad || 1}
                                                            className="form-control form-control-sm"
                                                            id={`quantity-${product.id}`}
                                                            defaultValue="1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => {
                                                                const quantity = parseInt(document.getElementById(`quantity-${product.id}`).value) || 1
                                                                handleProductSelect(product, quantity)
                                                            }}
                                                        >
                                                            Agregar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Client Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Información del Cliente</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={invoiceData.clientName}
                                        onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={invoiceData.clientLastName}
                                        onChange={(e) => setInvoiceData({...invoiceData, clientLastName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Género</label>
                                    <select
                                        className="form-control"
                                        value={invoiceData.clientGender}
                                        onChange={(e) => setInvoiceData({...invoiceData, clientGender: e.target.value})}
                                    >
                                        <option value="">Seleccionar género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={invoiceData.clientEmail}
                                        onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={invoiceData.clientPhone}
                                        onChange={(e) => setInvoiceData({...invoiceData, clientPhone: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Cédula</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={invoiceData.clientId}
                                        onChange={(e) => setInvoiceData({...invoiceData, clientId: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Items de la Factura</h5>
                        </div>
                        <div className="card-body">
                            {selectedItems.length === 0 ? (
                                <p className="text-muted">No hay items seleccionados</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>${item.price?.toLocaleString() || 0}</td>
                                                    <td>${item.subtotal?.toLocaleString() || 0}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => removeItem(index)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                <td className="fw-bold">${calculateTotal().toLocaleString()}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generate Invoice Button */}
                    {selectedItems.length > 0 && (
                        <div className="text-center">
                            <button
                                className="btn btn-success btn-lg"
                                onClick={generateInvoice}
                            >
                                Generar Factura e Imprimir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Facturacion
