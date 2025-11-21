import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useInformeVehiculos from '../../hooks/useInformeVehiculos'
import request from '../../utils/request'
import { hostUrl } from '../../utils/globals'
import imageCompression from 'browser-image-compression'

const NuevoInformeVehiculos = () => {
    const navigate = useNavigate()
    const { createInforme } = useInformeVehiculos()

    const [formData, setFormData] = useState({
        fecha_ingreso: new Date().toISOString().split('T')[0],
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        vehiculo_marca: '',
        vehiculo_modelo: '',
        vehiculo_vin: '',
        vehiculo_anio: '',
        vehiculo_color: '',
        vehiculo_kilometraje: '',
        vehiculo_fecha_shaken: '',
        vehiculo_estado_bateria: 'Buen estado',
        vehiculo_estado_aceite: 'Buen estado',
        vehiculo_estado_liquido_frenos: 'Buen estado',
        vehiculo_porcentaje_pastillas_freno: 100,
        vehiculo_porcentaje_neumaticos: 100,
        vehiculo_estado_liquido_refrigerante: 'Buen estado',
        vehiculo_detalles_pintura: '',
        vehiculo_observacion_general: '',
        vehiculo_imagen: '',
        vehiculo_foto_documentos: '',
        vehiculo_trabajos_realizar: ''
    })

    const [loading, setLoading] = useState(false)
    const [uploadingImages, setUploadingImages] = useState({})
    const [imageUploadErrors, setImageUploadErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,            // máximo 1 MB
            maxWidthOrHeight: 1024,   // redimensionar a 1024px máximo
            useWebWorker: true
        }
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    }

    const handleImageChange = async (fieldName, file) => {
        if (!file) return

        // Clear any previous error for this image
        setImageUploadErrors(prev => ({ ...prev, [fieldName]: null }))

        // Set uploading state
        setUploadingImages(prev => ({ ...prev, [fieldName]: true }))

        try {
            // Compress the image before sending
            const compressedFile = await compressImage(file)

            const newFile = new File([compressedFile], file.name, { type: compressedFile.type })

            // Create FormData with the compressed image
            const formDataUpload = new FormData()
            formDataUpload.append('image', newFile)

            // Upload to external server
            const response = await request.post(hostUrl + '/upload', formDataUpload)

            console.log("response post image: ", response)

            const fileName = response.data.filename

            // Save the name in the form data
            setFormData(prev => ({
                ...prev,
                [fieldName]: fileName
            }))

            // Clear any error for this image on success
            setImageUploadErrors(prev => ({ ...prev, [fieldName]: null }))
        } catch (error) {
            console.error('Error uploading image:', error)
            // Set specific error for this image
            setImageUploadErrors(prev => ({
                ...prev,
                [fieldName]: 'No se pudo cargar la imagen. Inténtalo de nuevo.'
            }))
        } finally {
            // Clear uploading state
            setUploadingImages(prev => ({ ...prev, [fieldName]: false }))
        }
    }

    const printReport = (reportData) => {
        const printWindow = window.open('', '_blank')
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('es-VE')
        }

        const getStatusBadge = (status) => {
            const colors = {
                'Buen estado': 'green',
                'Requiere atención': 'orange',
                'Malo': 'red'
            }
            return colors[status] || 'gray'
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Informe de Vehículo #${reportData.id}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #333;
                        margin: 0;
                    }
                    .section {
                        margin-bottom: 30px;
                        border: 1px solid #ddd;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .section h2 {
                        color: #333;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                        margin-top: 0;
                    }
                    .row {
                        display: flex;
                        margin-bottom: 10px;
                    }
                    .col {
                        flex: 1;
                        margin-right: 20px;
                    }
                    .col:last-child {
                        margin-right: 0;
                    }
                    .label {
                        font-weight: bold;
                        color: #555;
                    }
                    .status {
                        padding: 2px 8px;
                        border-radius: 3px;
                        color: white;
                        font-size: 12px;
                    }
                    .status-green { background-color: green; }
                    .status-orange { background-color: orange; }
                    .status-red { background-color: red; }
                    .image-container {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .image-container img {
                        max-width: 300px;
                        max-height: 200px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    @media print {
                        body { margin: 0; }
                        .section { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Informe de Inspección de Vehículo</h1>
                    <p><strong>ID del Informe:</strong> ${reportData.id}</p>
                </div>

                <div class="section">
                    <h2>Información General</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Fecha de Ingreso:</span> ${formatDate(reportData.fecha_ingreso)}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Datos del Cliente</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Nombre:</span> ${reportData.cliente_nombre}
                        </div>
                        <div class="col">
                            <span class="label">Teléfono:</span> ${reportData.cliente_telefono || 'N/A'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Email:</span> ${reportData.cliente_email || 'N/A'}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Datos del Vehículo</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Marca:</span> ${reportData.vehiculo_marca}
                        </div>
                        <div class="col">
                            <span class="label">Modelo:</span> ${reportData.vehiculo_modelo}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Año:</span> ${reportData.vehiculo_anio}
                        </div>
                        <div class="col">
                            <span class="label">Color:</span> ${reportData.vehiculo_color}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">VIN:</span> ${reportData.vehiculo_vin || 'N/A'}
                        </div>
                        <div class="col">
                            <span class="label">Kilometraje:</span> ${reportData.vehiculo_kilometraje || 'N/A'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Fecha Shaken:</span> ${reportData.vehiculo_fecha_shaken ? formatDate(reportData.vehiculo_fecha_shaken) : 'N/A'}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Estado del Vehículo</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Estado de la Batería:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_bateria)}">${reportData.vehiculo_estado_bateria}</span>
                        </div>
                        <div class="col">
                            <span class="label">Estado del Aceite:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_aceite)}">${reportData.vehiculo_estado_aceite}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Estado Líquido de Frenos:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_liquido_frenos)}">${reportData.vehiculo_estado_liquido_frenos}</span>
                        </div>
                        <div class="col">
                            <span class="label">Estado Líquido Refrigerante:</span>
                            <span class="status status-${getStatusBadge(reportData.vehiculo_estado_liquido_refrigerante)}">${reportData.vehiculo_estado_liquido_refrigerante}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="label">Porcentaje Pastillas de Freno:</span> ${reportData.vehiculo_porcentaje_pastillas_freno}%
                        </div>
                        <div class="col">
                            <span class="label">Porcentaje Neumáticos:</span> ${reportData.vehiculo_porcentaje_neumaticos}%
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Información Adicional</h2>
                    <div class="row">
                        <div class="col">
                            <span class="label">Detalles de Pintura:</span><br>
                            ${reportData.vehiculo_detalles_pintura || 'N/A'}
                        </div>
                        <div class="col">
                            <span class="label">Observación General:</span><br>
                            ${reportData.vehiculo_observacion_general || 'N/A'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col" style="width: 100%;">
                            <span class="label">Trabajos a Realizar:</span><br>
                            ${reportData.vehiculo_trabajos_realizar || 'N/A'}
                        </div>
                    </div>
                </div>

                ${reportData.vehiculo_imagen || reportData.vehiculo_foto_documentos ? `
                <div class="section">
                    <h2>Imágenes</h2>
                    <div class="row">
                        ${reportData.vehiculo_imagen ? `
                        <div class="col">
                            <span class="label">Imagen del Vehículo:</span>
                            <div class="image-container">
                                <img src="${hostUrl}/uploads/${reportData.vehiculo_imagen}" alt="Vehículo" />
                            </div>
                        </div>
                        ` : ''}
                        ${reportData.vehiculo_foto_documentos ? `
                        <div class="col">
                            <span class="label">Foto de Documentos:</span>
                            <div class="image-container">
                                <img src="${hostUrl}/uploads/${reportData.vehiculo_foto_documentos}" alt="Documentos" />
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <div class="section" style="text-align: center; margin-top: 50px;">
                    <p><strong>Fecha de Impresión:</strong> ${new Date().toLocaleDateString('es-VE')} ${new Date().toLocaleTimeString('es-VE')}</p>
                </div>
            </body>
            </html>
        `)

        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validate required fields
            if (!formData.fecha_ingreso || !formData.cliente_nombre || !formData.vehiculo_marca ||
                !formData.vehiculo_modelo || !formData.vehiculo_anio || !formData.vehiculo_color) {
                alert('Por favor complete todos los campos requeridos')
                return
            }

            const createdReport = await createInforme(formData)
            alert('Informe de vehículo creado exitosamente')

            // Print the report
            if (createdReport && createdReport.data) {
                printReport(createdReport.data)
            }

            navigate('/admin/informe-vehiculos')
        } catch (error) {
            console.error('Error creating report:', error)
            alert('Error al crear el informe: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const estadoOptions = ['Buen estado', 'Requiere atención', 'Malo']

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Nuevo Informe de Vehículo</h2>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/informe-vehiculos')}
                        >
                            Cancelar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Fecha de Ingreso */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5>Información General</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Fecha de Ingreso *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fecha_ingreso"
                                            value={formData.fecha_ingreso}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Information */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5>Datos del Cliente</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nombre *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="cliente_nombre"
                                            value={formData.cliente_nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="cliente_telefono"
                                            value={formData.cliente_telefono}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="cliente_email"
                                            value={formData.cliente_email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5>Datos del Vehículo</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Marca *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vehiculo_marca"
                                            value={formData.vehiculo_marca}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Modelo *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vehiculo_modelo"
                                            value={formData.vehiculo_modelo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Año *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vehiculo_anio"
                                            value={formData.vehiculo_anio}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Color *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vehiculo_color"
                                            value={formData.vehiculo_color}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">VIN</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vehiculo_vin"
                                            value={formData.vehiculo_vin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Kilometraje</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vehiculo_kilometraje"
                                            value={formData.vehiculo_kilometraje}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Fecha Shaken</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="vehiculo_fecha_shaken"
                                            value={formData.vehiculo_fecha_shaken}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Condition */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5>Estado del Vehículo</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Estado de la Batería</label>
                                        <select
                                            className="form-control"
                                            name="vehiculo_estado_bateria"
                                            value={formData.vehiculo_estado_bateria}
                                            onChange={handleChange}
                                        >
                                            {estadoOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Estado del Aceite</label>
                                        <select
                                            className="form-control"
                                            name="vehiculo_estado_aceite"
                                            value={formData.vehiculo_estado_aceite}
                                            onChange={handleChange}
                                        >
                                            {estadoOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Estado Líquido de Frenos</label>
                                        <select
                                            className="form-control"
                                            name="vehiculo_estado_liquido_frenos"
                                            value={formData.vehiculo_estado_liquido_frenos}
                                            onChange={handleChange}
                                        >
                                            {estadoOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Estado Líquido Refrigerante</label>
                                        <select
                                            className="form-control"
                                            name="vehiculo_estado_liquido_refrigerante"
                                            value={formData.vehiculo_estado_liquido_refrigerante}
                                            onChange={handleChange}
                                        >
                                            {estadoOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Porcentaje Pastillas de Freno</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="vehiculo_porcentaje_pastillas_freno"
                                            value={formData.vehiculo_porcentaje_pastillas_freno}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Porcentaje Neumáticos</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="vehiculo_porcentaje_neumaticos"
                                            value={formData.vehiculo_porcentaje_neumaticos}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5>Información Adicional</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Detalles de Pintura</label>
                                        <textarea
                                            className="form-control"
                                            name="vehiculo_detalles_pintura"
                                            value={formData.vehiculo_detalles_pintura}
                                            onChange={handleChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Observación General</label>
                                        <textarea
                                            className="form-control"
                                            name="vehiculo_observacion_general"
                                            value={formData.vehiculo_observacion_general}
                                            onChange={handleChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label className="form-label">Trabajos a Realizar</label>
                                        <textarea
                                            className="form-control"
                                            name="vehiculo_trabajos_realizar"
                                            value={formData.vehiculo_trabajos_realizar}
                                            onChange={handleChange}
                                            rows="4"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Imagen del Vehículo</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange('vehiculo_imagen', e.target.files[0])}
                                            disabled={uploadingImages.vehiculo_imagen}
                                        />
                                        {uploadingImages.vehiculo_imagen && (
                                            <div className="mt-2">
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                                <span className="ms-2">Subiendo imagen...</span>
                                            </div>
                                        )}
                                        {imageUploadErrors.vehiculo_imagen && (
                                            <div className="text-danger mt-1">
                                                {imageUploadErrors.vehiculo_imagen}
                                            </div>
                                        )}
                                        {formData.vehiculo_imagen && !uploadingImages.vehiculo_imagen && (
                                            <div className="mt-2">
                                                <small className="text-success">Imagen subida: {formData.vehiculo_imagen}</small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Foto de Documentos</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange('vehiculo_foto_documentos', e.target.files[0])}
                                            disabled={uploadingImages.vehiculo_foto_documentos}
                                        />
                                        {uploadingImages.vehiculo_foto_documentos && (
                                            <div className="mt-2">
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                                <span className="ms-2">Subiendo imagen...</span>
                                            </div>
                                        )}
                                        {imageUploadErrors.vehiculo_foto_documentos && (
                                            <div className="text-danger mt-1">
                                                {imageUploadErrors.vehiculo_foto_documentos}
                                            </div>
                                        )}
                                        {formData.vehiculo_foto_documentos && !uploadingImages.vehiculo_foto_documentos && (
                                            <div className="mt-2">
                                                <small className="text-success">Imagen subida: {formData.vehiculo_foto_documentos}</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Crear Informe'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NuevoInformeVehiculos
