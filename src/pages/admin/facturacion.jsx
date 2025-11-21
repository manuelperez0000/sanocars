import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useVehicles from '../../hooks/useVehicles'
import useInventory from '../../hooks/useInventory'
import useFacturas from '../../hooks/useFacturas'

const Facturacion = () => {
    const navigate = useNavigate()
    const { vehicles, loading: vehiclesLoading } = useVehicles()
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
    const [paymentData, setPaymentData] = useState({
        paymentType: 'contado', // 'contado' or 'cuotas'
        installments: 1,
        frequency: 'mensuales', // 'mensuales', 'semanales', 'quincenales'
        startDate: new Date().toISOString().split('T')[0]
    })

    // Modal states
    const [vehicleModalOpen, setVehicleModalOpen] = useState(false)
    const [productModalOpen, setProductModalOpen] = useState(false)
    const [serviceModalOpen, setServiceModalOpen] = useState(false)
    const [rentalModalOpen, setRentalModalOpen] = useState(false)

    // Test data for services and rentals since they're not implemented
    const testServices = [
        { id: 1, name: 'Mecánica General', price: 50000 },
        { id: 2, name: 'Planchado y Pintura', price: 150000 },
        { id: 3, name: 'Grúa 24 Horas', price: 30000 },
        { id: 4, name: 'Documentación', price: 25000 }
    ]

    const rentalOptions = [
        { type: 'Diario', multiplier: 1, basePrice: 25000 },
        { type: 'Semanal', multiplier: 7, basePrice: 150000 },
        { type: 'Mensual', multiplier: 30, basePrice: 500000 }
    ]

    const handleBillingTypeSelect = (type) => {
        if (type === 'vehicle') {
            setVehicleModalOpen(true)
        } else if (type === 'product') {
            setProductModalOpen(true)
        } else if (type === 'service') {
            setServiceModalOpen(true)
        } else if (type === 'rental') {
            setRentalModalOpen(true)
        }
    }

    const handleVehicleSelect = (vehicle) => {
        const item = {
            type: 'vehicle',
            id: vehicle.id,
            name: `${vehicle.marca} ${vehicle.modelo} ${vehicle.year}`,
            price: vehicle.precio,
            quantity: 1,
            subtotal: vehicle.precio
        }
        setSelectedItems([...selectedItems, item])
        setVehicleModalOpen(false)
    }

    const handleProductSelect = (product, quantity) => {
        const item = {
            type: 'product',
            id: product.id,
            name: product.nombre,
            price: product.precio,
            quantity: quantity,
            subtotal: product.precio * quantity
        }
        setSelectedItems([...selectedItems, item])
        setProductModalOpen(false)
    }

    const handleServiceSelect = (service) => {
        const item = {
            type: 'service',
            id: service.id,
            name: service.name,
            price: service.price,
            quantity: 1,
            subtotal: service.price
        }
        setSelectedItems([...selectedItems, item])
        setServiceModalOpen(false)
    }

    const handleRentalSelect = (vehicle, rentalType) => {
        const option = rentalOptions.find(opt => opt.type === rentalType)
        const item = {
            type: 'rental',
            id: vehicle.id,
            name: `Alquiler ${vehicle.marca} ${vehicle.modelo} - ${rentalType}`,
            price: option.basePrice,
            quantity: 1,
            rentalType: rentalType,
            subtotal: option.basePrice
        }
        setSelectedItems([...selectedItems, item])
        setRentalModalOpen(false)
    }

    const removeItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index))
    }

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.subtotal, 0)
    }

    const generateInstallments = (totalAmount, paymentData) => {
        const installments = []
        const installmentAmount = Math.ceil(totalAmount / paymentData.installments)
        let currentDate = new Date(paymentData.startDate)

        for (let i = 1; i <= paymentData.installments; i++) {
            const dueDate = new Date(currentDate)

            // Calculate next due date based on frequency
            if (paymentData.frequency === 'semanales') {
                currentDate.setDate(currentDate.getDate() + 7)
            } else if (paymentData.frequency === 'quincenales') {
                currentDate.setDate(currentDate.getDate() + 15)
            } else if (paymentData.frequency === 'mensuales') {
                currentDate.setMonth(currentDate.getMonth() + 1)
            }

            installments.push({
                number: i,
                amount: installmentAmount,
                dueDate: dueDate.toLocaleDateString(),
                status: 'Pendiente'
            })
        }

        return installments
    }

    const generateInvoice = async () => {
        try {
            const total = calculateTotal()
            const hasVehicle = selectedItems.some(item => item.type === 'vehicle')
            const hasProduct = selectedItems.some(item => item.type === 'product')
            const hasRental = selectedItems.some(item => item.type === 'rental')

            // Determine invoice type
            let tipo = 'servicio' // default
            if (hasVehicle) tipo = 'venta'
            else if (hasRental) tipo = 'alquiler'
            else if (hasProduct) tipo = 'producto'

            const installments = hasVehicle && paymentData.paymentType === 'cuotas'
                ? generateInstallments(total, paymentData)
                : []

            // Prepare invoice data for database
            const invoiceDataForDB = {
                tipo: tipo,
                cliente_nombre: invoiceData.clientName,
                cliente_apellido: invoiceData.clientLastName,
                cliente_genero: invoiceData.clientGender,
                cliente_email: invoiceData.clientEmail,
                cliente_telefono: invoiceData.clientPhone,
                cliente_cedula: invoiceData.clientId,
                items: selectedItems,
                total: total,
                datos_pago: hasVehicle ? paymentData : null,
                cuotas: installments.length > 0 ? installments : null
            }

            // Save to database
            const savedInvoice = await createFactura(invoiceDataForDB)

            // Prepare data for printing
            const invoice = {
                ...invoiceData,
                id: savedInvoice.id,
                items: selectedItems,
                total: total,
                paymentData: hasVehicle ? paymentData : null,
                installments: installments,
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

                        ${invoice.installments && invoice.installments.length > 0 ? `
                            <h3>Plan de Cuotas</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Número de Cuota</th>
                                        <th>Monto</th>
                                        <th>Fecha de Vencimiento</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoice.installments.map(installment => `
                                        <tr>
                                            <td>${installment.number}</td>
                                            <td>$${installment.amount?.toLocaleString() || 0}</td>
                                            <td>${installment.dueDate}</td>
                                            <td>${installment.status}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
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
            setPaymentData({
                paymentType: 'contado',
                installments: 1,
                frequency: 'mensuales',
                startDate: new Date().toISOString().split('T')[0]
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

                    {/* Billing Type Selection */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Seleccionar Tipo de Facturación</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <button
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => handleBillingTypeSelect('vehicle')}
                                    >
                                        Venta de Vehículo
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button
                                        className="btn btn-outline-success w-100"
                                        onClick={() => handleBillingTypeSelect('rental')}
                                    >
                                        Alquiler de Vehículo
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button
                                        className="btn btn-outline-info w-100"
                                        onClick={() => handleBillingTypeSelect('product')}
                                    >
                                        Producto
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button
                                        className="btn btn-outline-warning w-100"
                                        onClick={() => handleBillingTypeSelect('service')}
                                    >
                                        Servicio
                                    </button>
                                </div>
                            </div>
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
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
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

                    {/* Payment Section - Only show when vehicle is selected */}
                    {selectedItems.some(item => item.type === 'vehicle') && (
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5>Información de Pago</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Tipo de Pago</label>
                                        <select
                                            className="form-control"
                                            value={paymentData.paymentType}
                                            onChange={(e) => setPaymentData({...paymentData, paymentType: e.target.value})}
                                        >
                                            <option value="contado">Pago de Contado</option>
                                            <option value="cuotas">Pago en Cuotas</option>
                                        </select>
                                    </div>
                                </div>

                                {paymentData.paymentType === 'cuotas' && (
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Número de Cuotas</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                max="60"
                                                value={paymentData.installments}
                                                onChange={(e) => setPaymentData({...paymentData, installments: parseInt(e.target.value) || 1})}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Frecuencia</label>
                                            <select
                                                className="form-control"
                                                value={paymentData.frequency}
                                                onChange={(e) => setPaymentData({...paymentData, frequency: e.target.value})}
                                            >
                                                <option value="mensuales">Mensuales</option>
                                                <option value="semanales">Semanales</option>
                                                <option value="quincenales">Quincenales</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Fecha de Inicio</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={paymentData.startDate}
                                                onChange={(e) => setPaymentData({...paymentData, startDate: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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

            {/* Vehicle Selection Modal */}
            {vehicleModalOpen && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Seleccionar Vehículo</h5>
                                    <button type="button" className="btn-close" onClick={() => setVehicleModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {vehiclesLoading ? (
                                        <div>Cargando vehículos...</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Marca</th>
                                                        <th>Modelo</th>
                                                        <th>Año</th>
                                                        <th>Precio</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vehicles.filter(v => v.status === 'En Venta').map(vehicle => (
                                                        <tr key={vehicle.id}>
                                                            <td>{vehicle.marca}</td>
                                                            <td>{vehicle.modelo}</td>
                                                            <td>{vehicle.year}</td>
                                                            <td>${vehicle.precio?.toLocaleString() || 0}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleVehicleSelect(vehicle)}
                                                                >
                                                                    Seleccionar
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
                        </div>
                    </div>
                </>
            )}

            {/* Product Selection Modal */}
            {productModalOpen && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Seleccionar Producto</h5>
                                    <button type="button" className="btn-close" onClick={() => setProductModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {inventoryLoading ? (
                                        <div>Cargando productos...</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Fabricante</th>
                                                        <th>Precio</th>
                                                        <th>Cantidad Disponible</th>
                                                        <th>Cantidad a Facturar</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inventory.map(product => (
                                                        <tr key={product.id}>
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
                                                                    Seleccionar
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
                        </div>
                    </div>
                </>
            )}

            {/* Service Selection Modal */}
            {serviceModalOpen && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Seleccionar Servicio</h5>
                                    <button type="button" className="btn-close" onClick={() => setServiceModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Servicio</th>
                                                    <th>Precio</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testServices.map(service => (
                                                    <tr key={service.id}>
                                                        <td>{service.name}</td>
                                                        <td>${service.price?.toLocaleString() || 0}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleServiceSelect(service)}
                                                            >
                                                                Seleccionar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Rental Selection Modal */}
            {rentalModalOpen && (
                <>
                    <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Seleccionar Vehículo para Alquiler</h5>
                                    <button type="button" className="btn-close" onClick={() => setRentalModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {vehiclesLoading ? (
                                        <div>Cargando vehículos...</div>
                                    ) : (
                                        <div>
                                            <div className="mb-3">
                                                <label className="form-label">Tipo de Alquiler</label>
                                                <select className="form-control" id="rentalType">
                                                    {rentalOptions.map(option => (
                                                        <option key={option.type} value={option.type}>
                                                            {option.type} - ${option.basePrice?.toLocaleString() || 0}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Marca</th>
                                                            <th>Modelo</th>
                                                            <th>Año</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {vehicles.filter(v => v.status === 'En alquiler').map(vehicle => (
                                                            <tr key={vehicle.id}>
                                                                <td>{vehicle.marca}</td>
                                                                <td>{vehicle.modelo}</td>
                                                                <td>{vehicle.year}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-primary"
                                                                        onClick={() => {
                                                                            const rentalType = document.getElementById('rentalType').value
                                                                            handleRentalSelect(vehicle, rentalType)
                                                                        }}
                                                                    >
                                                                        Seleccionar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Facturacion
