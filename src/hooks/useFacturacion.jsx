import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import useInventory from './useInventory'
import useFacturas from './useFacturas'
import useUsers from './useUsers'

const useFacturacion = () => {

    const navigate = useNavigate()
    const { inventory, loading: inventoryLoading } = useInventory()
    const { createFactura } = useFacturas()
    const { users, handleCreate } = useUsers()

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

    // User search state
    const [userSearch, setUserSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [showUserDropdown, setShowUserDropdown] = useState(false)

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

    // Filter users based on search
    useEffect(() => {
        if (users && userSearch.trim()) {
            const filtered = users.filter(user =>
                user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.mobile_no?.includes(userSearch)
            )
            setFilteredUsers(filtered)
            setShowUserDropdown(filtered.length > 0)
        } else {
            setFilteredUsers([])
            setShowUserDropdown(false)
        }
    }, [users, userSearch])

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

    const handleUserSearch = (value) => {
        setUserSearch(value)
    }

    const selectUser = (user) => {
        setInvoiceData({
            ...invoiceData,
            clientName: user.name || '',
            clientEmail: user.email || '',
            clientPhone: user.mobile_no || '',
            clientAddress: user.address || '',
            clientId: user.id
        })
        setUserSearch('')
        setShowUserDropdown(false)
    }

    const registerAndGenerateInvoice = async () => {
        try {
            // Generate invoice first
            const savedInvoice = await generateInvoice()

            // After successful invoice generation, check if user exists
            const existingUser = users.find(user =>
                user.email === invoiceData.clientEmail ||
                (user.name === invoiceData.clientName && user.mobile_no === invoiceData.clientPhone)
            )

            if (!existingUser && invoiceData.clientName.trim() && invoiceData.clientEmail.trim()) {
                // Register new user
                const userPayload = {
                    name: invoiceData.clientName.trim(),
                    lastname: 'N/A',
                    email: invoiceData.clientEmail.trim(),
                    password: 's6d54f6s5d4f6s5d4f654s4df654', // Default password for new users
                    mobile_no: invoiceData.clientPhone.trim() || '',
                    address: invoiceData.clientAddress.trim() || '',
                    nationality: 'Japon',
                    role: 'customer'
                }

                await handleCreate(userPayload)
            }

            // Navigate to invoice after everything is done
            const id = savedInvoice.id
            navigate(`/admin/factura/${id}`)
        } catch (error) {
            console.error('Error registering user or generating invoice:', error)
            alert('Error al procesar la solicitud: ' + error.message)
        }
    }

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.subtotal, 0)
    }

    const generateInvoice = async () => {
        try {
            // Validation
            if (!invoiceData.clientName.trim()) {
                const error = new Error('Agregue el nombre del cliente')
                alert(error.message)
                throw error
            }

            if (selectedItems.length === 0) {
                const error = new Error('Debe agregar al menos un producto a la factura')
                alert(error.message)
                throw error
            }

            const total = calculateTotal()

            // Prepare invoice data for database
            const invoiceDataForDB = {
                tipo: 'producto',
                cliente_nombre: invoiceData.clientName.trim(),
                cliente_apellido: "n/a",
                cliente_genero: "n/a",
                cliente_email: invoiceData.clientEmail.trim() || null,
                cliente_telefono: invoiceData.clientPhone.trim() || null,
                cliente_direccion: invoiceData.clientAddress.trim() || null,
                items: selectedItems,
                total: total,
                datos_pago: null,
                cuotas: null
            }

            // Save to database
            const savedInvoice = await createFactura(invoiceDataForDB)

            return savedInvoice
        } catch (error) {
            console.error('Error generating invoice:', error)
            alert('Error al generar la factura: ' + error.message)
            throw error
        }

    }

    return {
        navigate, selectedItems,
        setInvoiceData, invoiceData,
        setProductSearch, productSearch,
        removeItem, filteredProducts,
        calculateTotal, inventoryLoading,
        generateInvoice, handleProductSelect,
        // User search functionality
        userSearch, setUserSearch, handleUserSearch,
        filteredUsers, showUserDropdown,
        selectUser, registerAndGenerateInvoice
    }
}

export default useFacturacion
