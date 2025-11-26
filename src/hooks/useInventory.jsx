import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl, topurl } from '../utils/globals'
import imageCompression from 'browser-image-compression';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const useInventory = () => {
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        nombre: '',
        fabricante: '',
        precio: '',
        cantidad: '',
        detalle: '',
        imagenes: []
    })
    const [uploadingImages, setUploadingImages] = useState({})
    const [imageUploadErrors, setImageUploadErrors] = useState({})

    useEffect(() => {
        fetchInventory()
    }, [])

    async function fetchInventory() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/inventory')
            if (resp?.data?.body) {
                setInventory(resp.data.body)
            }
        } catch (err) {
            console.error('fetchInventory error', err)
            setError(err?.response?.data?.message || 'Error cargando inventario')
        } finally {
            setLoading(false)
        }
    }

    function openNew() {
        setEditing(null)
        const newForm = {
            nombre: '',
            fabricante: '',
            precio: '',
            cantidad: '',
            detalle: '',
            imagenes: ['']
        }
        setForm(newForm)
        setModalOpen(true)
    }

    function openEdit(item) {
        setEditing(item)
        // copy to avoid mutation
        const formData = Object.assign({}, item)

        // Convert imagenes string to array
        const imagenes = []
        if (formData.imagenes) {
            // Parse the string format "['image1.jpg'],['image2.png']" back to array
            const matches = formData.imagenes.match(/'([^']+)'/g)
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
            // Save the name in the array
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
            const imagenes = form.imagenes.length > 0
                ? form.imagenes.map(img => `'${img}'`).join(',')
                : ''

            const dataToSend = {
                ...form,
                imagenes
            }

            if (editing && editing.id) {
                await request.put(apiurl + '/inventory/' + editing.id, dataToSend)
            } else {
                await request.post(apiurl + '/inventory', dataToSend)
            }
            setModalOpen(false)
            fetchInventory()
        } catch (err) {
            console.error('save inventory item error', err)
            setError(err?.response?.data?.message || 'Error guardando producto')
        }
    }

    async function handleDelete(item) {
        if (!confirm(`¿Eliminar el producto "${item.nombre}" del fabricante "${item.fabricante}"?`)) return
        try {
            await request.delete(apiurl + '/inventory/' + item.id)
            fetchInventory()
        } catch (err) {
            console.error('delete inventory item error', err)
            setError(err?.response?.data?.message || 'Error eliminando producto')
        }
    }

    // derive visibleInventory (for now just return all, can add filtering later)
    const visibleInventory = inventory

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
        inventory,
        loading,
        error,
        modalOpen,
        setModalOpen,
        editing,
        form,
        uploadingImages,
        imageUploadErrors,
        visibleInventory,
        fetchInventory,
        openNew,
        openEdit,
        handleChange,
        handleImageChange,
        addImageInput,
        removeImageInput,
        handleSave,
        handleDelete,
        getImages,
        getArrayImages
    }
}

export default useInventory
