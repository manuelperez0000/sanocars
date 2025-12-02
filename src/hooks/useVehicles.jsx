import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl, topurl } from '../utils/globals'
import { getEmptyForm } from '../utils/getEmptyForm'
import imageCompression from 'browser-image-compression';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const useVehicles = () => {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('En Venta')

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(getEmptyForm())
    const [uploadingImages, setUploadingImages] = useState({})
    const [imageUploadErrors, setImageUploadErrors] = useState({})

    // Sales modal
    const [salesModalOpen, setSalesModalOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [salesForm, setSalesForm] = useState(getEmptySalesForm())

    // Rental modal
    const [rentalModalOpen, setRentalModalOpen] = useState(false)
    const [selectedRentalVehicle, setSelectedRentalVehicle] = useState(null)
    const [rentalForm, setRentalForm] = useState(getEmptyRentalForm())

    useEffect(() => {
        fetchVehicles()
    }, [])

    async function fetchVehicles() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/vehicles')
            if (resp?.data?.body) {
                setVehicles(resp.data.body)
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Error cargando vehículos')
        } finally {
            setLoading(false)
        }
    }

    function openNew() {
        
        setEditing(null)
        const newForm = getEmptyForm()
        // Ensure at least one empty image input
        if (newForm.imagenes.length === 0) {
            newForm.imagenes = ['']
        }
        setForm(newForm)
        setModalOpen(true)
    }

    function openEdit(v) {
        
        setEditing(v)
        // copy to avoid mutation
        const formData = Object.assign({}, v)

        // Convert imagen1 and imagen2 to imagenes array
        const imagenes = []
        if (formData.imagen1) {
            // Parse the string format "['image1.jpg'],['image2.png']" back to array
            const matches = formData.imagen1.match(/'([^']+)'/g)
            if (matches) {
                matches.forEach(match => {
                    imagenes.push(match.replace(/'/g, ''))
                })
            }
        }
        formData.imagenes = imagenes

        setForm(formData)
        setModalOpen(true)
    }

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function compressImage(file) {
        const options = {
            maxSizeMB: 1,            // máximo 1 MB
            maxWidthOrHeight: 1024,   // redimensionar a 1024px máximo
            useWebWorker: true
        }
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    }

    async function handleImageChange(index, file) {
        if (!file) return

        // Clear any previous error for this image
        setImageUploadErrors(prev => ({ ...prev, [index]: null }))

        // Set uploading state
        setUploadingImages(prev => ({ ...prev, [index]: true }))

        try {
            // 👉 Comprimir la imagen antes de enviarla
            const compressedFile = await compressImage(file)

            const newFile = new File([compressedFile], file.name, { type: compressedFile.type })

            // Crear FormData con la imagen comprimida
            const formData = new FormData()
            formData.append('image', newFile)

            // Subir al servidor externo
            const response = await request.post(apiurl + '/imagesUploader/upload', formData)

            const fileName = response.data.body.filename
            // Guardar el nombre en el array
            setForm(prev => {
                const newImagenes = [...prev.imagenes]
                newImagenes[index] = fileName
                return { ...prev, imagenes: newImagenes }
            })

            // Clear any error for this image on success
            setImageUploadErrors(prev => ({ ...prev, [index]: null }))
        } catch (error) {
            console.error('image upload error', error)
            // Set specific error for this image
            setImageUploadErrors(prev => ({
                ...prev,
                [index]: 'No se pudo cargar la imagen. Inténtalo de nuevo.'
            }))
        } finally {
            // Clear uploading state
            setUploadingImages(prev => ({ ...prev, [index]: false }))
        }
    }

    function addImageInput() {
        setForm(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, '']
        }))
    }

    function removeImageInput(index) {
        setForm(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }))
    }

    async function handleSave(e) {
        e.preventDefault()
        try {
            // Convert imagenes array to string format for backend
            const imagen1 = form.imagenes.length > 0
                ? form.imagenes.map(img => `'${img}'`).join(',')
                : ''
            const imagen2 = ''

            const dataToSend = {
                ...form,
                imagen1,
                imagen2
            }

            if (editing && editing.id) {
                
                await request.put(apiurl + '/vehicles/' + editing.id, dataToSend)
            } else {
                
                await request.post(apiurl + '/vehicles', dataToSend)
            }
            setModalOpen(false)
            fetchVehicles()
        } catch (err) {
            console.error('save vehicle error', err)
            setError(err?.response?.data?.message || 'Error guardando vehículo')
        }
    }

    async function handleMarkAsSold(v) {
        if (!confirm(`Marcar como vendido el vehículo ${v.marca} ${v.modelo} (ID ${v.id})?`)) return
        try {
            await request.put(apiurl + '/vehicles/' + v.id, { status: 'vendido' })
            fetchVehicles()
        } catch (err) {
            console.error('mark as sold error', err)
            setError(err?.response?.data?.message || 'Error marcando vehículo como vendido')
        }
    }

    async function handleMarkAsDeleted(v) {
        if (!confirm(`Marcar como eliminado el vehículo ${v.marca} ${v.modelo} (ID ${v.id})?`)) return
        try {
            await request.put(apiurl + '/vehicles/' + v.id, { status: 'eliminado' })
            fetchVehicles()
        } catch (err) {
            console.error('mark as deleted error', err)
            setError(err?.response?.data?.message || 'Error marcando vehículo como eliminado')
        }
    }

    // Sales functions
    function getEmptySalesForm() {
        return {
            // Client data
            cliente_nombre: '',
            cliente_apellido: '',
            cliente_email: '',
            cliente_telefono: '',
            cliente_direccion: '',

            // Payment data
            precio_venta: 0,
            tipo_pago: 'contado',
            numero_cuotas: 1,
            frecuencia_cuotas: 'mensual',
            monto_inicial: 0,
            tasa_interes: 0,
            total_con_intereses: 0,
            fecha_inicial: new Date().toISOString().split('T')[0], // Today's date
            siguientes_pagos: []
        }
    }

    // Rental functions
    function getEmptyRentalForm() {
        return {
            // Client data
            cliente_nombre: '',
            cliente_email: '',
            cliente_telefono: '',
            cliente_direccion: '',

            // Rental data
            fecha_inicio: new Date().toISOString().split('T')[0], // Today's date
            precio_alquiler: 0
        }
    }

    function openSalesModal(vehicle) {
        setSelectedVehicle(vehicle)
        const salesFormData = getEmptySalesForm()
        salesFormData.precio_venta = vehicle.precio || 0
        salesFormData.total_con_intereses = vehicle.precio || 0
        setSalesForm(salesFormData)
        setSalesModalOpen(true)
    }

    function closeSalesModal() {
        setSalesModalOpen(false)
        setSelectedVehicle(null)
        setSalesForm(getEmptySalesForm())
    }

    function openRentalModal(vehicle) {
        setSelectedRentalVehicle(vehicle)
        const rentalFormData = getEmptyRentalForm()
        setRentalForm(rentalFormData)
        setRentalModalOpen(true)
    }

    function closeRentalModal() {
        setRentalModalOpen(false)
        setSelectedRentalVehicle(null)
        setRentalForm(getEmptyRentalForm())
    }

    function handleRentalChange(e) {
        const { name, value } = e.target
        setRentalForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSaveRental(e) {
        e.preventDefault()

        try {
            const rentalData = {
                vehiculo_id: selectedRentalVehicle.id,
                ...rentalForm
            }

            // Save the rental
            await request.post(apiurl + '/alquileres', rentalData)

            // Create payment tracking record for the rental
            const paymentData = {
                vehiculo_id: selectedRentalVehicle.id,
                pagos_realizados: [], // Start with empty array
                fecha_proximo_pago: rentalForm.fecha_inicio // Next payment date starts as rental start date
            }
            await request.post(apiurl + '/pagos-alquileres', paymentData)

            // Mark vehicle as rented (not available for sale anymore)
            await request.put(apiurl + '/vehicles/' + selectedRentalVehicle.id, { status: 'alquilado' })

            closeRentalModal()
            fetchVehicles()

        } catch (err) {
            console.error('save rental error', err)
            setError(err?.response?.data?.message || 'Error guardando alquiler')
        }
    }

    function handleSalesChange(e) {
        const { name, value } = e.target
        setSalesForm(prev => ({ ...prev, [name]: value }))

        // Recalculate totals when relevant fields change
        if (['precio_venta', 'tipo_pago', 'numero_cuotas', 'monto_inicial', 'tasa_interes', 'fecha_inicial', 'frecuencia_cuotas'].includes(name)) {
            setTimeout(calculateSalesTotal, 100) // Small delay to ensure state is updated
        }
    }

    function calculateSalesTotal() {
        setSalesForm(prev => {
            const precio_venta = parseFloat(prev.precio_venta) || 0
            const monto_inicial = parseFloat(prev.monto_inicial) || 0
            const tasa_interes = parseFloat(prev.tasa_interes) || 0
            const numero_cuotas = parseInt(prev.numero_cuotas) || 1
            const frecuencia_cuotas = prev.frecuencia_cuotas || 'mensual'
            const fecha_inicial = prev.fecha_inicial || new Date().toISOString().split('T')[0]

            let total_con_intereses = precio_venta
            let siguientes_pagos = []

            if (prev.tipo_pago === 'cuotas') {
                // Calculate financed amount, then add interest on financed amount to sale price
                const monto_financiado = precio_venta - monto_inicial
                const interes_total = monto_financiado * (tasa_interes / 100)
                total_con_intereses = precio_venta + interes_total

                // Calculate payment schedule
                const monto_cuota = total_con_intereses / numero_cuotas
                let currentDate = new Date(fecha_inicial)

                for (let i = 1; i <= numero_cuotas; i++) {
                    // Calculate next payment date based on frequency
                    if (frecuencia_cuotas === 'semanal') {
                        currentDate.setDate(currentDate.getDate() + 7)
                    } else if (frecuencia_cuotas === 'quincenal') {
                        currentDate.setDate(currentDate.getDate() + 15)
                    } else if (frecuencia_cuotas === 'mensual') {
                        currentDate.setMonth(currentDate.getMonth() + 1)
                    }

                    siguientes_pagos.push({
                        numero_cuota: i,
                        fecha_pago: currentDate.toISOString().split('T')[0],
                        monto: monto_cuota.toFixed(2)
                    })
                }
            }

            return {
                ...prev,
                total_con_intereses: total_con_intereses.toFixed(2),
                siguientes_pagos: siguientes_pagos
            }
        })
    }

    async function handleSaveSale(e) {
        e.preventDefault()
       
        try {
            const saleData = {
                tipo: 'vehiculo',
                vehiculo_id: selectedVehicle.id,
                ...salesForm,
                siguientes_pagos: JSON.stringify(salesForm.siguientes_pagos),
                datos_pago: JSON.stringify({
                    tipo_pago: salesForm.tipo_pago,
                    numero_cuotas: salesForm.numero_cuotas,
                    frecuencia_cuotas: salesForm.frecuencia_cuotas,
                    monto_inicial: salesForm.monto_inicial,
                    tasa_interes: salesForm.tasa_interes
                })
            }

            // Save the sale
            await request.post(apiurl + '/venta', saleData)

            // Mark vehicle as sold
            await request.put(apiurl + '/vehicles/' + selectedVehicle.id, { status: 'vendido' })

            closeSalesModal()
            fetchVehicles()

            // Print invoice
            printSaleInvoice(saleData)

        } catch (err) {
            console.error('save sale error', err)
            setError(err?.response?.data?.message || 'Error guardando venta')
        }
    }

    function printSaleInvoice(saleData) {
        const vehicle = selectedVehicle
        const printWindow = window.open('', '_blank')
        const invoiceHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura de Venta - ${vehicle.marca} ${vehicle.modelo}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.4;
                    }
                    .invoice-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .invoice-title {
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #2c3e50;
                    }
                    .invoice-subtitle {
                        font-size: 16px;
                        color: #7f8c8d;
                    }
                    .invoice-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .info-section {
                        flex: 1;
                    }
                    .info-section h4 {
                        margin: 0 0 10px 0;
                        color: #2c3e50;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .info-section p {
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .vehicle-details {
                        margin-bottom: 30px;
                    }
                    .vehicle-details h4 {
                        margin: 0 0 15px 0;
                        color: #2c3e50;
                        font-size: 16px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: repeat(5, 1fr);
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    .detail-item {
                        font-size: 14px;
                        line-height: 1.4;
                        padding: 5px 0;
                        padding: 5px;
                    }
                    .border{
                        border: 1px solid #020202ff;
                        padding: 5px;
                    }
                    .payment-details {
                        margin-bottom: 30px;
                    }
                    .payment-details h4 {
                        margin: 0 0 15px 0;
                        color: #2c3e50;
                        font-size: 16px;
                    }
                    .totals-section {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .totals-box {
                        border: 1px solid #ddd;
                        padding: 20px;
                        background-color: #f8f9fa;
                        min-width: 250px;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                    .totals-row.total {
                        border-top: 2px solid #333;
                        padding-top: 10px;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .text-center{
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        flex-direction: column;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #7f8c8d;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <h1 class="invoice-title">Factura de Venta</h1>
                    <p class="invoice-subtitle">Vehículo: ${vehicle.marca} ${vehicle.modelo}</p>
                </div>

                <div class="invoice-info">
                    <div class="info-section">
                        <h4>Información del Cliente</h4>
                        <p><strong>Nombre:</strong> ${saleData.cliente_nombre || 'N/A'} ${saleData.cliente_apellido || ''}</p>
                        <p><strong>Teléfono:</strong> ${saleData.cliente_telefono || 'N/A'}</p>
                        <p><strong>Email:</strong> ${saleData.cliente_email || 'N/A'}</p>
                        <p><strong>Dirección:</strong> ${saleData.cliente_direccion || 'N/A'}</p>
                    </div>
                    <div class="info-section">
                        <h4>Información del Vehículo</h4>
                        <p><strong>Marca:</strong> ${vehicle.marca || 'N/A'}</p>
                        <p><strong>Modelo:</strong> ${vehicle.modelo || 'N/A'}</p>
                        <p><strong>Año:</strong> ${vehicle.anio || 'N/A'}</p>
                        <p><strong>Placa:</strong> ${vehicle.numero_placa || 'N/A'}</p>
                        <p><strong>Color:</strong> ${vehicle.color || 'N/A'}</p>
                        <p><strong>ID Vehículo:</strong> ${vehicle.id}</p>
                    </div>
                    <div class="info-section">
                        <h4>Información de Venta</h4>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                        <p><strong>Tipo de Pago:</strong> ${saleData.tipo_pago === 'contado' ? 'De Contado' : 'A Cuotas'}</p>
                        ${saleData.tipo_pago === 'cuotas' ? `
                        <p><strong>Número de Cuotas:</strong> ${saleData.numero_cuotas}</p>
                        <p><strong>Frecuencia:</strong> ${saleData.frecuencia_cuotas}</p>
                        <p><strong>Monto Inicial:</strong> $${parseFloat(saleData.monto_inicial || 0).toFixed(2)}</p>
                        <p><strong>Tasa de Interés:</strong> ${saleData.tasa_interes}%</p>
                        ` : ''}
                    </div>
                </div>

                <div class="vehicle-details">
                    <h4>Detalles del Vehículo</h4>
                    <div class="details-grid">
                        <div class="detail-item text-center">
                            <strong>Kilometraje:</strong>
                            
                            ${vehicle.kilometraje || 'N/A'} km
                        </div>
                        <div class="detail-item text-center"><strong>Tipo:</strong> ${vehicle.tipo_vehiculo || 'N/A'}</div>
                        <div class="detail-item text-center"><strong>Tamaño Motor:</strong> ${vehicle.tamano_motor || 'N/A'}</div>
                        <div class="detail-item text-center"><strong>Número de Chasis:</strong> ${vehicle.numero_chasis || 'N/A'}</div>
                        ${vehicle.observaciones ? `<div class="detail-item text-center"><strong>Observaciones:</strong> ${vehicle.observaciones}</div>` : '<div class="detail-item"></div>'}
                    </div>
                </div>

                <div class="payment-details">
                    <h4>Detalles del Pago</h4>
                    <div class="details-grid">
                        <div class="detail-item"><strong>Precio de Venta:</strong> $${parseFloat(saleData.precio_venta || 0).toFixed(2)}</div>
                        ${saleData.tipo_pago === 'cuotas' ? `
                        <div class="detail-item"><strong>Monto Inicial:</strong> $${parseFloat(saleData.monto_inicial || 0).toFixed(2)}</div>
                        <div class="detail-item"><strong>Financiamiento:</strong> $${(parseFloat(saleData.precio_venta || 0) - parseFloat(saleData.monto_inicial || 0)).toFixed(2)}</div>
                        <div class="detail-item"><strong>Intereses (${saleData.tasa_interes}%):</strong> $${((parseFloat(saleData.precio_venta || 0) - parseFloat(saleData.monto_inicial || 0)) * (parseFloat(saleData.tasa_interes || 0) / 100)).toFixed(2)}</div>
                        <div class="detail-item"><strong>Número de Cuotas:</strong> ${saleData.numero_cuotas}</div>
                        <div class="detail-item"><strong>Frecuencia:</strong> ${saleData.frecuencia_cuotas}</div>
                        <div class="detail-item"><strong>Fecha Inicial:</strong> ${saleData.fecha_inicial ? new Date(saleData.fecha_inicial).toLocaleDateString('es-ES') : 'N/A'}</div>
                        ` : `
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                        `}
                    </div>
                </div>

                ${saleData.tipo_pago === 'cuotas' && saleData.siguientes_pagos ? `
                <div class="payment-schedule">
                    <h4>Cronograma de Pagos</h4>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cuota</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha de Pago</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(() => {
                                try {
                                    const pagos = typeof saleData.siguientes_pagos === 'string'
                                        ? JSON.parse(saleData.siguientes_pagos)
                                        : saleData.siguientes_pagos;
                                    return pagos && pagos.length > 0 ? pagos.map(pago => `
                                        <tr>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${pago.numero_cuota}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(pago.fecha_pago).toLocaleDateString('es-ES')}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${pago.monto}</td>
                                        </tr>
                                    `).join('') : '';
                                } catch {
                                    return '';
                                }
                            })()}
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <div class="totals-section">
                    <div class="totals-box">
                        <div class="totals-row">
                            <span>Precio de Venta:</span>
                            <span>$${parseFloat(saleData.precio_venta || 0).toFixed(2)}</span>
                        </div>
                        ${saleData.tipo_pago === 'cuotas' ? `
                        <div class="totals-row">
                            <span>Menos Inicial:</span>
                            <span>-$${parseFloat(saleData.monto_inicial || 0).toFixed(2)}</span>
                        </div>
                        <div class="totals-row">
                            <span>Más Intereses:</span>
                            <span>+$${((parseFloat(saleData.precio_venta || 0) - parseFloat(saleData.monto_inicial || 0)) * (parseFloat(saleData.tasa_interes || 0) / 100)).toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="totals-row total">
                            <span>Total a Pagar:</span>
                            <span>$${parseFloat(saleData.total_con_intereses || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Gracias por su compra. Venta realizada por Sanocars Taller.</p>
                    <p>Fecha de emisión: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
                </div>
            </body>
            </html>
        `

        printWindow.document.write(invoiceHTML)
        printWindow.document.close()

        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print()
        }
    }

    // derive visibleVehicles based on filter to keep JSX clean
    const visibleVehicles = (vehicles || []).filter(x => {
        if (filter === 'all') return true
        if (filter === 'En Venta') return x.status === 'En Venta'
        if (filter === 'En alquiler') return x.status === 'En alquiler'
        if (filter === 'vendido') return x.status === 'vendido'
        if (filter === 'eliminado') return x.status === 'eliminado'
        return true
    })

    const getArrayImages = (imageList) => {
        const imagesArray = imageList
            .split(',')
            .map(img => img.trim().replace(/^'|'$/g, ''));
        return imagesArray;
    }

    const getImages = (imageList) => {
        const imagesArray = getArrayImages(imageList);
        // Component for image gallery with modal
        const ImageGallery = () => {
            const [modalOpen, setModalOpen] = useState(false);
            const [modalIndex, setModalIndex] = useState(0);

            useEffect(() => {
                if (!modalOpen) return;
                function onKey(e) {
                    if (e.key === 'Escape') setModalOpen(false);
                    if (e.key === 'ArrowLeft') setModalIndex(i => (i - 1 + imagesArray.length) % imagesArray.length);
                    if (e.key === 'ArrowRight') setModalIndex(i => (i + 1) % imagesArray.length);
                }
                window.addEventListener('keydown', onKey);
                return () => window.removeEventListener('keydown', onKey);
            }, [modalOpen, modalIndex, imagesArray.length]);

            function openModal(index) {
                setModalIndex(index);
                setModalOpen(true);
            }

            function closeModal() {
                setModalOpen(false);
            }

            function prevImage() {
                setModalIndex((i) => (i - 1 + imagesArray.length) % imagesArray.length);
            }

            function nextImage() {
                setModalIndex((i) => (i + 1) % imagesArray.length);
            }

            return (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                        gap: '8px',
                        maxWidth: '260px' // 3 images * 80px + 2 gaps * 8px
                    }}>
                        {imagesArray.map((imageName, index) => (
                            <img
                                key={index}
                                src={`${topurl}/uploads/${imageName}`}
                                alt={imageName}
                                onClick={() => openModal(index)}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #e0e0e0',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>

                    {/* Modal for full-screen gallery */}
                    {modalOpen && (
                        <div className="gallery-modal d-flex align-items-center justify-content-center" onClick={closeModal} style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            zIndex: 1050
                        }}>
                            <button
                                className="gallery-close btn btn-link text-light position-absolute"
                                onClick={(e) => { e.stopPropagation(); closeModal(); }}
                                aria-label="Cerrar"
                                style={{
                                    top: '20px',
                                    right: '20px',
                                    zIndex: 1051,
                                    border: 'none',
                                    background: 'none',
                                    color: 'white',
                                    fontSize: '28px'
                                }}
                            >
                                <FaTimes />
                            </button>

                            <button
                                className="gallery-nav left btn btn-link text-light position-absolute"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                aria-label="Anterior"
                                style={{
                                    left: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1051,
                                    border: 'none',
                                    background: 'none',
                                    color: 'white',
                                    fontSize: '36px'
                                }}
                            >
                                <FaChevronLeft />
                            </button>

                            <img
                                src={`${apiurl}/uploads/${imagesArray[modalIndex]}`}
                                alt={`full-${modalIndex}`}
                                className="img-fluid"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                    objectFit: 'contain'
                                }}
                            />

                            <button
                                className="gallery-nav right btn btn-link text-light position-absolute"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                aria-label="Siguiente"
                                style={{
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1051,
                                    border: 'none',
                                    background: 'none',
                                    color: 'white',
                                    fontSize: '36px'
                                }}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            );
        };

        return <ImageGallery />;
    };


    return {
        vehicles,
        loading,
        error,
        filter,
        setFilter,
        modalOpen,
        setModalOpen,
        editing,
        form,
        uploadingImages,
        imageUploadErrors,
        salesModalOpen,
        selectedVehicle,
        salesForm,
        rentalModalOpen,
        selectedRentalVehicle,
        rentalForm,
        visibleVehicles,
        fetchVehicles,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleMarkAsSold,
        handleMarkAsDeleted,
        openSalesModal,
        closeSalesModal,
        handleSalesChange,
        handleSaveSale,
        openRentalModal,
        closeRentalModal,
        handleRentalChange,
        handleSaveRental,
        getImages,
        getArrayImages
    }
}

export default useVehicles
