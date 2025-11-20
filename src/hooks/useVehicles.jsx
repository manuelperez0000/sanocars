import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl, hostUrl } from '../utils/globals'
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
            const response = await request.post(hostUrl + '/upload', formData)

            console.log("response post image: ", response)

            const fileName = response.data.filename

            // Guardar el nombre en el array
            setForm(prev => {
                const newImagenes = [...prev.imagenes]
                newImagenes[index] = fileName
                return { ...prev, imagenes: newImagenes }
            })

            // Clear any error for this image on success
            setImageUploadErrors(prev => ({ ...prev, [index]: null }))
        } catch (error) {
            console.error('Error uploading image:', error)
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
                                src={`${hostUrl}/uploads/${imageName}`}
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
                                src={`${hostUrl}/uploads/${imagesArray[modalIndex]}`}
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
        getImages,
        getArrayImages
    }
}

export default useVehicles
