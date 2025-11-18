import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'
import { getEmptyForm } from '../utils/getEmptyForm'

const useVehicles = () => {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(getEmptyForm())
    const [uploadingImages, setUploadingImages] = useState({})

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
            console.error('fetchVehicles error', err)
            setError(err.message || 'Error cargando vehículos')
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

    async function handleImageChange(index, file) {
        if (!file) return

        // Set uploading state
        setUploadingImages(prev => ({ ...prev, [index]: true }))

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('image', file)

            // Upload to external server
            const response = await
                request.post('http://mitaller.sanocarstaller.com/upload', formData)

            console.log("response fetch image: ", response)

            const fileName = request.data.body

            // Store the uploaded filename in the array
            setForm(prev => {
                const newImagenes = [...prev.imagenes]
                newImagenes[index] = fileName
                return { ...prev, imagenes: newImagenes }
            })
        } catch (error) {
            console.error('Error uploading image:', error)
            setError('Error subiendo la imagen')
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
            setError(err.message || 'Error guardando vehículo')
        }
    }

    async function handleMarkAsSold(v) {
        if (!confirm(`Marcar como vendido el vehículo ${v.marca} ${v.modelo} (ID ${v.id})?`)) return
        try {
            await request.put(apiurl + '/vehicles/' + v.id, { status: 'vendido' })
            fetchVehicles()
        } catch (err) {
            console.error('mark as sold error', err)
            setError(err.message || 'Error marcando vehículo como vendido')
        }
    }

    async function handleMarkAsDeleted(v) {
        if (!confirm(`Marcar como eliminado el vehículo ${v.marca} ${v.modelo} (ID ${v.id})?`)) return
        try {
            await request.put(apiurl + '/vehicles/' + v.id, { status: 'eliminado' })
            fetchVehicles()
        } catch (err) {
            console.error('mark as deleted error', err)
            setError(err.message || 'Error marcando vehículo como eliminado')
        }
    }

    // derive visibleVehicles based on filter to keep JSX clean
    const visibleVehicles = (vehicles || []).filter(x => {
        if (filter === 'all') return true
        if (filter === 'En Venta') return x.status === 'En Venta'
        if (filter === 'vendido') return x.status === 'vendido'
        if (filter === 'eliminado') return x.status === 'eliminado'
        return true
    })

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
        handleMarkAsDeleted
    }
}

export default useVehicles
