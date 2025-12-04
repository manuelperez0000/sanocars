import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'
import imageCompression from 'browser-image-compression';

const useInspeccionVehicular = () => {
    const [loadCar, setLoadCar] = useState(false)
    const [inspecciones, setInspecciones] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        cliente_tipo: 'nuevo',
        cliente_id: '',
        cliente_nombre: '',
        cliente_email: '',
        cliente_telefono: '',
        cliente_direccion: '',
        vehiculo_marca: '',
        vehiculo_modelo: '',
        vehiculo_anio: '',
        vehiculo_color: '',
        vehiculo_placa: '',
        vehiculo_fecha_shaken: '',
        vehiculo_estado_aceite: '',
        vehiculo_pastillas_freno: '',
        vehiculo_neumaticos: '',
        vehiculo_estado_bateria: '',
        vehiculo_observaciones: '',
        vehiculo_trabajos_realizar: '',
        vehiculo_detalles_pintura: '',
        foto_vehiculo: '',
        foto_documento: ''
    })
    const [uploadingImages, setUploadingImages] = useState({})
    const [imageUploadErrors, setImageUploadErrors] = useState({})

    useEffect(() => {
        fetchInspecciones()
        setTimeout(()=>{
            setLoadCar(true)
        },2500)
    }, [])

    async function fetchInspecciones() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/inspeccion-vehicular')
            if (resp?.data?.body) {
                setInspecciones(resp.data.body)
            }
        } catch (err) {
            console.error('fetchInspecciones error', err)
            setError(err?.response?.data?.message || 'Error cargando inspecciones')
        } finally {
            setLoading(false)
        }
    }

    function openNew() {
        setEditing(null)
        const newForm = {
            cliente_tipo: 'nuevo',
            cliente_id: '',
            cliente_nombre: '',
            cliente_email: '',
            cliente_telefono: '',
            cliente_direccion: '',
            vehiculo_marca: '',
            vehiculo_modelo: '',
            vehiculo_anio: '',
            vehiculo_color: '',
            vehiculo_placa: '',
            vehiculo_fecha_shaken: '',
            vehiculo_estado_aceite: '',
            vehiculo_pastillas_freno: '',
            vehiculo_neumaticos: '',
            vehiculo_estado_bateria: '',
            vehiculo_observaciones: '',
            vehiculo_trabajos_realizar: '',
            vehiculo_detalles_pintura: '',
            foto_vehiculo: '',
            foto_documento: ''
        }
        setForm(newForm)
        setModalOpen(true)
    }

    function openEdit(inspeccion) {
        setEditing(inspeccion)
        setForm({ ...inspeccion })
        setModalOpen(true)
    }

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))

        // Reset client fields when changing client type
        if (name === 'cliente_tipo') {
            if (value === 'nuevo') {
                setForm(prev => ({
                    ...prev,
                    cliente_tipo: value,
                    cliente_id: '',
                    cliente_nombre: '',
                    cliente_email: '',
                    cliente_telefono: '',
                    cliente_direccion: ''
                }))
            } else if (value === 'registrado') {
                setForm(prev => ({
                    ...prev,
                    cliente_tipo: value,
                    cliente_id: '',
                    cliente_nombre: '',
                    cliente_email: '',
                    cliente_telefono: '',
                    cliente_direccion: ''
                }))
            }
        }
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

    async function handleImageChange(field, file) {
        if (!file) return

        // Clear any previous error for this image
        setImageUploadErrors(prev => ({ ...prev, [field]: null }))

        // Set uploading state
        setUploadingImages(prev => ({ ...prev, [field]: true }))

        try {
            // Compress the image before sending
            const compressedFile = await compressImage(file)

            const newFile = new File([compressedFile], file.name, { type: compressedFile.type })

            // Create FormData with the compressed image
            const formData = new FormData()
            formData.append('image', newFile)

            // Upload to external server
            const response = await request.post(apiurl + '/imagesUploader/upload', formData)

            console.log("response post image: ", response)

            const fileName = response.data.body?.filename
            // Save the name in the form
            setForm(prev => ({ ...prev, [field]: fileName }))

            // Clear any error for this image on success
            setImageUploadErrors(prev => ({ ...prev, [field]: null }))
        } catch (error) {
            console.error('Error uploading image:', error)
            // Set specific error for this image
            setImageUploadErrors(prev => ({
                ...prev,
                [field]: 'No se pudo cargar la imagen. Inténtalo de nuevo.'
            }))
        } finally {
            // Clear uploading state
            setUploadingImages(prev => ({ ...prev, [field]: false }))
        }
    }

    async function handleSave(e) {
        e.preventDefault()
        try {
            const dataToSend = { ...form }

            // Convert percentages to numbers
            if (dataToSend.vehiculo_pastillas_freno) {
                dataToSend.vehiculo_pastillas_freno = parseInt(dataToSend.vehiculo_pastillas_freno)
            }

            if (editing && editing.id) {
                await request.put(apiurl + '/inspeccion-vehicular/' + editing.id, dataToSend)
            } else {
                await request.post(apiurl + '/inspeccion-vehicular', dataToSend)
            }
            setModalOpen(false)
            fetchInspecciones()
        } catch (err) {
            console.error('save inspeccion error', err)
            setError(err.response.data.message || 'Error guardando inspección')
        }
    }

    async function handleDelete(inspeccion) {
        if (!confirm(`¿Eliminar la inspección del vehículo ${inspeccion.vehiculo_marca} ${inspeccion.vehiculo_modelo}?`)) return
        try {
            await request.delete(apiurl + '/inspeccion-vehicular/' + inspeccion.id)
            fetchInspecciones()
        } catch (err) {
            console.error('delete inspeccion error', err)
            setError(err?.response?.data?.message || 'Error eliminando inspección')
        }
    }

    // Search clients (mock implementation - would need actual client API)
    const [clientes, setClientes] = useState([])
    const [searchingClients, setSearchingClients] = useState(false)

    async function searchClients(query) {
        if (!query || query.length < 2) {
            setClientes([])
            return
        }

        setSearchingClients(true)
        try {
            // Mock search - replace with actual API call
            const mockClients = [
                { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '0412-1234567' },
                { id: 2, nombre: 'María García', email: 'maria@example.com', telefono: '0414-7654321' },
                { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', telefono: '0424-9876543' }
            ].filter(client =>
                client.nombre.toLowerCase().includes(query.toLowerCase()) ||
                client.email.toLowerCase().includes(query.toLowerCase())
            )
            setClientes(mockClients)
        } catch (err) {
            console.error('search clients error', err)
        } finally {
            setSearchingClients(false)
        }
    }

    function selectClient(client) {
        setForm(prev => ({
            ...prev,
            cliente_id: client.id,
            cliente_nombre: client.nombre,
            cliente_email: client.email,
            cliente_telefono: client.telefono || '',
            cliente_direccion: client.direccion || ''
        }))
        setClientes([])
    }

    return {
        inspecciones,
        loading,
        error,
        modalOpen,
        setModalOpen,
        editing,
        form,
        uploadingImages,
        imageUploadErrors,
        fetchInspecciones,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        handleSave,
        handleDelete,
        clientes,
        searchingClients,
        searchClients,
        selectClient,
        loadCar
    }
}

export default useInspeccionVehicular
