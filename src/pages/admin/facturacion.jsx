
import useFacturacion from '../../hooks/useFacturacion'
import ClientInformation from '../../components/ClientInformation'
import { formatBigNumber, formatCurrency } from '../../utils/globals'

const Facturacion = () => {
    const { navigate, selectedItems, registerAndGenerateInvoice,
        invoiceData,
        setInvoiceData, removeItem,
        calculateTotal, productSearch,
        setProductSearch,
        inventoryLoading, filteredProducts, handleProductSelect } = useFacturacion()

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Facturación</h2>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/admin/facturas')}
                        >
                            Ver Todas las Facturas
                        </button>
                        {/* Generate Invoice Button */}
                        {(
                            <div className="text-center">
                                <button
                                    disabled={selectedItems.length === 0}
                                    className="btn btn-success btn-lg"
                                    onClick={registerAndGenerateInvoice}
                                >
                                    Imprimir
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Client Information */}
                    <ClientInformation
                        invoiceData={invoiceData}
                        setInvoiceData={setInvoiceData}
                    />

                    {/* Product Search */}
                    <div className="card mb-4">

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
                                                    <td>{formatCurrency(product.precio)}</td>
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
                    {/* Invoice Items */}
                    <div className="mb-4">
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
                                                    <td>{formatBigNumber(item.quantity)}</td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>{formatCurrency(item.subtotal)}</td>
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
                                                <td className="fw-bold">{formatCurrency(calculateTotal())}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generate Invoice Button */}
                    {(
                        <div className="text-center">
                            <button
                                disabled={selectedItems.length === 0}
                                className="btn btn-success btn-lg"
                                onClick={registerAndGenerateInvoice}
                            >
                                Imprimir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Facturacion
