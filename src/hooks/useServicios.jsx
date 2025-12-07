import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'
import imageCompression from 'browser-image-compression';

const useServicios = () => {
    const [servicios, setServicios] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(getEmptyServicioForm())
    const [uploadingImages, setUploadingImages] = useState({})
    const [imageUploadErrors, setImageUploadErrors] = useState({})

    // Modal for service details
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [currentDetail, setCurrentDetail] = useState({ descripcion: '', cantidad: 1, precio_unitario: 0 })

    // Modal for IVA editing
    const [ivaModalOpen, setIvaModalOpen] = useState(false)
    const [ivaPercentage, setIvaPercentage] = useState(10)

    useEffect(() => {
        fetchServicios()
    }, [])

    async function fetchServicios() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/servicios')
            if (resp?.data?.body) {
                setServicios(resp.data.body)
            }
        } catch (err) {
            console.error('fetchServicios error', err)
            setError(err?.response?.data?.message || 'Error cargando servicios')
        } finally {
            setLoading(false)
        }
    }

    function getEmptyServicioForm() {
        return {
            // Client data
            nombre_cliente: '',
            telefono_cliente: '',
            email_cliente: '',
            direccion_cliente: '',

            // Vehicle data
            marca_vehiculo: '',
            modelo_vehiculo: '',
            anio_vehiculo: '',
            placa_vehiculo: '',
            color_vehiculo: '',
            kilometraje_vehiculo: '',
            fecha_shaken: '',

            // Service details (JSON array)
            detalles: [],

            // Totals
            subtotal: 0,
            iva: 10,
            total: 0,

            // Payment information
            tipo_pago: '',
            numero_cuotas: 1,
            fecha_pagos: '',
            cronograma_pagos: null,

            // Additional
            fecha_servicio: new Date().toISOString().split('T')[0],
            notas: '',
            fotos: [],
            status: 'Pendiente'
        }
    }

    function openNew() {
        setEditing(null)
        setForm(getEmptyServicioForm())
        setModalOpen(true)
    }

    function openEdit(servicio) {
        setEditing(servicio)
        const formData = { ...servicio }

        // Parse detalles if it's a string
        if (typeof formData.detalles === 'string') {
            try {
                formData.detalles = JSON.parse(formData.detalles)
            } catch {
                formData.detalles = []
            }
        }

        // Parse fotos if it's a string
        if (typeof formData.fotos === 'string') {
            try {
                formData.fotos = JSON.parse(formData.fotos)
            } catch {
                formData.fotos = []
            }
        }

        // Parse cronograma_pagos if it's a string
        if (typeof formData.cronograma_pagos === 'string') {
            try {
                formData.cronograma_pagos = JSON.parse(formData.cronograma_pagos)
            } catch {
                formData.cronograma_pagos = null
            }
        }

        // Format fecha_shaken for date input (YYYY-MM-DD format)
        if (formData.fecha_shaken) {
            try {
                const date = new Date(formData.fecha_shaken)
                if (!isNaN(date.getTime())) {
                    formData.fecha_shaken = date.toISOString().split('T')[0]
                }
            } catch {
                // If parsing fails, set to empty string
                formData.fecha_shaken = ''
            }
        } else {
            formData.fecha_shaken = ''
        }

        // Format fecha_pagos for date input (YYYY-MM-DD format)
        if (formData.fecha_pagos) {
            try {
                const date = new Date(formData.fecha_pagos)
                if (!isNaN(date.getTime())) {
                    formData.fecha_pagos = date.toISOString().split('T')[0]
                }
            } catch {
                // If parsing fails, set to empty string
                formData.fecha_pagos = ''
            }
        } else {
            formData.fecha_pagos = ''
        }

        // Ensure arrays exist
        if (!Array.isArray(formData.detalles)) formData.detalles = []
        if (!Array.isArray(formData.fotos)) formData.fotos = []

        setForm(formData)
        setModalOpen(true)
    }

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => {
            const updatedForm = { ...prev, [name]: value }

            // Calculate payment schedule if payment-related fields change
            if (['tipo_pago', 'numero_cuotas', 'fecha_pagos'].includes(name)) {
                updatedForm.cronograma_pagos = calculatePaymentSchedule(updatedForm)
            }

            return updatedForm
        })
    }

    function calculatePaymentSchedule(formData) {
        if (formData.tipo_pago !== 'cuotas' || !formData.numero_cuotas || !formData.fecha_pagos || !formData.total) {
            return null
        }

        const numeroCuotas = parseInt(formData.numero_cuotas)
        const totalAmount = parseFloat(formData.total)

        // Parse date components directly from the string to avoid timezone issues
        const [year, month, day] = formData.fecha_pagos.split('-').map(Number)
        const startYear = year
        const startMonth = month - 1 // JavaScript months are 0-based
        const startDay = day

        if (numeroCuotas <= 0 || totalAmount <= 0 || !startYear || startMonth < 0 || !startDay) {
            return null
        }

        const installmentAmount = Math.ceil(totalAmount / numeroCuotas) // Round up to avoid fractions
        const schedule = []

        for (let i = 0; i < numeroCuotas; i++) {
            // Create date for each installment by adding months to the start date
            const paymentDate = new Date(startYear, startMonth + i, startDay)

            // Format date as YYYY-MM-DD consistently
            const formattedYear = paymentDate.getFullYear()
            const formattedMonth = String(paymentDate.getMonth() + 1).padStart(2, '0')
            const formattedDay = String(paymentDate.getDate()).padStart(2, '0')
            const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`

            schedule.push({
                numero_cuota: i + 1,
                fecha_pago: formattedDate,
                monto: installmentAmount,
                pagado: false
            })
        }

        // Adjust the last installment to account for rounding
        const totalCalculated = schedule.reduce((sum, cuota) => sum + cuota.monto, 0)
        if (totalCalculated !== totalAmount) {
            schedule[schedule.length - 1].monto = installmentAmount - (totalCalculated - totalAmount)
        }

        return schedule
    }

    // Service details modal functions
    function openDetailsModal(detail = null, index = null) {
        if (detail) {
            setCurrentDetail({ ...detail, index })
        } else {
            setCurrentDetail({ descripcion: '', cantidad: 1, precio_unitario: 0 })
        }
        setDetailsModalOpen(true)
    }

    function closeDetailsModal() {
        setDetailsModalOpen(false)
        setCurrentDetail({ descripcion: '', cantidad: 1, precio_unitario: 0 })
    }

    function handleDetailChange(e) {
        const { name, value } = e.target
        setCurrentDetail(prev => ({ ...prev, [name]: value }))
    }

    function saveDetail() {
        const { descripcion, cantidad, precio_unitario } = currentDetail
        if (!descripcion.trim()) return

        const newDetail = {
            descripcion: descripcion.trim(),
            cantidad: parseInt(cantidad) || 1,
            precio_unitario: parseInt(precio_unitario) || 0,
            total: (parseInt(cantidad) || 1) * (parseInt(precio_unitario) || 0)
        }

        setForm(prev => {
            const newDetalles = [...prev.detalles]
            if (currentDetail.index !== undefined) {
                newDetalles[currentDetail.index] = newDetail
            } else {
                newDetalles.push(newDetail)
            }
            return { ...prev, detalles: newDetalles }
        })

        calculateTotals()
        closeDetailsModal()
    }

    function removeDetail(index) {
        setForm(prev => ({
            ...prev,
            detalles: prev.detalles.filter((_, i) => i !== index)
        }))
        calculateTotals()
    }

    function calculateTotals() {
        setForm(prev => {
            const subtotal = prev.detalles.reduce((sum, detail) => sum + detail.total, 0)
            const iva = subtotal * (ivaPercentage / 100) // Use custom IVA percentage
            const total = subtotal + iva

            const updatedForm = {
                ...prev,
                subtotal: subtotal,
                iva: iva,
                total: total
            }

            // Recalculate payment schedule if totals changed and payment type is installments
            if (prev.tipo_pago === 'cuotas') {
                updatedForm.cronograma_pagos = calculatePaymentSchedule(updatedForm)
            }

            return updatedForm
        })
    }

    // IVA modal functions
    function openIvaModal() {
        setIvaModalOpen(true)
    }

    function closeIvaModal() {
        setIvaModalOpen(false)
    }

    function saveIvaPercentage() {
        calculateTotals()
        closeIvaModal()
    }

    async function compressImage(file) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true
        }
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    }

    async function handleImageChange(index, file) {
        if (!file) return

        setImageUploadErrors(prev => ({ ...prev, [index]: null }))
        setUploadingImages(prev => ({ ...prev, [index]: true }))

        try {
            const compressedFile = await compressImage(file)
            const newFile = new File([compressedFile], file.name, { type: compressedFile.type })

            const formData = new FormData()
            formData.append('image', newFile)

            const response = await request.post(apiurl + '/imagesUploader/upload', formData)
            const fileName = response.data.body?.filename

            setForm(prev => {
                const newFotos = [...prev.fotos]
                newFotos[index] = fileName
                return { ...prev, fotos: newFotos }
            })

            setImageUploadErrors(prev => ({ ...prev, [index]: null }))
        } catch (error) {
            console.error('Error uploading image:', error)
            setImageUploadErrors(prev => ({
                ...prev,
                [index]: 'No se pudo cargar la imagen. Inténtalo de nuevo.'
            }))
        } finally {
            setUploadingImages(prev => ({ ...prev, [index]: false }))
        }
    }

    function addImageInput() {
        setForm(prev => ({
            ...prev,
            fotos: [...prev.fotos, '']
        }))
    }

    function removeImageInput(index) {
        setForm(prev => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index)
        }))
    }

    async function handleSave(e) {
        e.preventDefault()
        try {
            const dataToSend = {
                ...form,
                detalles: JSON.stringify(form.detalles),
                fotos: JSON.stringify(form.fotos),
                cronograma_pagos: form.cronograma_pagos ? JSON.stringify(form.cronograma_pagos) : null
            }

            if (editing && editing.id) {
                await request.put(apiurl + '/servicios/' + editing.id, dataToSend)
            } else {
                await request.post(apiurl + '/servicios', dataToSend)
            }
            setModalOpen(false)
            fetchServicios()
        } catch (err) {
            console.error('save servicio error', err)
            setError(err?.response?.data?.message || 'Error guardando servicio')
        }
    }

    async function handleDelete(servicio) {
        if (!confirm(`¿Eliminar el servicio de ${servicio.nombre_cliente} (${servicio.marca_vehiculo} ${servicio.modelo_vehiculo})?`)) return
        try {
            await request.delete(apiurl + '/servicios/' + servicio.id)
            fetchServicios()
        } catch (err) {
            console.error('delete servicio error', err)
            setError(err?.response?.data?.message || 'Error eliminando servicio')
        }
    }

    return {
        servicios,
        loading,
        error,
        modalOpen,
        setModalOpen,
        editing,
        form,
        setForm,
        uploadingImages,
        imageUploadErrors,
        detailsModalOpen,
        currentDetail,
        ivaModalOpen,
        ivaPercentage,
        setIvaPercentage,
        fetchServicios,
        openNew,
        openEdit,
        handleChange,
        openDetailsModal,
        closeDetailsModal,
        handleDetailChange,
        saveDetail,
        removeDetail,
        calculateTotals,
        openIvaModal,
        closeIvaModal,
        saveIvaPercentage,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleDelete
    }
}

export default useServicios
