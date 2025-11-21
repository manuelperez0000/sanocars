import { useState } from 'react'
import request from '../utils/request.js'
import { apiurl } from '../utils/globals.js'
const Financiamiento = () => {
    const [formData, setFormData] = useState({
        // Información Cliente - Katakana
        apellidosKatakana: '',
        nombresKatakana: '',
        // Información Cliente - Kanji
        apellidosKanji: '',
        nombresKanji: '',
        fechaNacimiento: '',
        genero: '',
        tipoConyuge: '',
        direccionActual: '',
        personasViviendo: '',
        tiempoDireccion: '',
        cantidadHijos: '',
        relacionJefeHogar: '',
        cabezaFamilia: '',
        pagoHipotecaAlquiler: '',
        telefonoCasa: '',
        telefonoMovil: '',
        // Información del Trabajo Cliente - Katakana
        nombreEmpresaKatakana: '',
        // Información del Trabajo Cliente - Kanji
        nombreEmpresaKanji: '',
        direccionTrabajo: '',
        telefonoTrabajo: '',
        tipoIndustria: '',
        tiempoTrabajando: '',
        ingresoMensual: '',
        ingresoAnual: '',
        diaPago: '',
        nombreEmpresaContratista: '',
        direccionEmpresaContratista: '',
        telefonoEmpresaContratista: ''
    })

    const [documents, setDocuments] = useState({
        seiruCadoFrontal: null,
        seiruCadoTrasera: null,
        licenciaConducirFrontal: null,
        licenciaConducirTrasera: null,
        kokuminShakaiHoken: null,
        libretaBanco: null
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        setDocuments({
            ...documents,
            [name]: files[0]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Create FormData for file uploads
            const formDataToSend = new FormData()

            // Add form data
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '') {
                    formDataToSend.append(key, formData[key])
                }
            })

            // Add files
            if (documents.seiruCadoFrontal) {
                formDataToSend.append('seiruCadoFrontal', documents.seiruCadoFrontal)
            }
            if (documents.seiruCadoTrasera) {
                formDataToSend.append('seiruCadoTrasera', documents.seiruCadoTrasera)
            }
            if (documents.licenciaConducirFrontal) {
                formDataToSend.append('licenciaConducirFrontal', documents.licenciaConducirFrontal)
            }
            if (documents.licenciaConducirTrasera) {
                formDataToSend.append('licenciaConducirTrasera', documents.licenciaConducirTrasera)
            }
            if (documents.kokuminShakaiHoken) {
                formDataToSend.append('kokuminShakaiHoken', documents.kokuminShakaiHoken)
            }
            if (documents.libretaBanco) {
                formDataToSend.append('libretaBanco', documents.libretaBanco)
            }

            // Send to backend
            const response = await request.post( apiurl + '/financing', formDataToSend)

            if (response?.data) {
                alert('¡Formulario enviado exitosamente! Nos pondremos en contacto contigo pronto.')
                // Reset form
                setFormData({
                    apellidosKatakana: '',
                    nombresKatakana: '',
                    apellidosKanji: '',
                    nombresKanji: '',
                    fechaNacimiento: '',
                    genero: '',
                    tipoConyuge: '',
                    direccionActual: '',
                    personasViviendo: '',
                    tiempoDireccion: '',
                    cantidadHijos: '',
                    relacionJefeHogar: '',
                    cabezaFamilia: '',
                    pagoHipotecaAlquiler: '',
                    telefonoCasa: '',
                    telefonoMovil: '',
                    nombreEmpresaKatakana: '',
                    nombreEmpresaKanji: '',
                    direccionTrabajo: '',
                    telefonoTrabajo: '',
                    tipoIndustria: '',
                    tiempoTrabajando: '',
                    ingresoMensual: '',
                    ingresoAnual: '',
                    diaPago: '',
                    nombreEmpresaContratista: '',
                    direccionEmpresaContratista: '',
                    telefonoEmpresaContratista: ''
                })
                setDocuments({
                    seiruCadoFrontal: null,
                    seiruCadoTrasera: null,
                    licenciaConducirFrontal: null,
                    licenciaConducirTrasera: null,
                    kokuminShakaiHoken: null,
                    libretaBanco: null
                })
            } else {
                alert('Error al enviar el formulario: ' + response.data.message)
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.')
        }
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <h2 className="momo mb-4 text-center">Solicitud de Financiamiento</h2>
                    <p className="text-center mb-5">
                        Completa este formulario para solicitar financiamiento para tu vehículo.
                        Asegúrate de escribir correctamente en katakana y kanji según se indique.
                    </p>

                    <form onSubmit={handleSubmit} className="financing-form">
                        {/* INFORMACIÓN CLIENTE */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h3 className="card-title mb-0">INFORMACIÓN CLIENTE</h3>
                            </div>
                            <div className="card-body">
                                {/* Katakana Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">
                                        ESCRIBIR EN KATAKANA
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="apellidosKatakana" className="form-label">
                                                APELLIDOS: *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="apellidosKatakana"
                                                name="apellidosKatakana"
                                                value={formData.apellidosKatakana}
                                                onChange={handleChange}
                                                placeholder="Ej: スミス"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nombresKatakana" className="form-label">
                                                NOMBRES: *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nombresKatakana"
                                                name="nombresKatakana"
                                                value={formData.nombresKatakana}
                                                onChange={handleChange}
                                                placeholder="Ej: ジョン"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Kanji Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">
                                        ESCRIBIR EN KANJI
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="apellidosKanji" className="form-label">
                                                APELLIDOS: *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="apellidosKanji"
                                                name="apellidosKanji"
                                                value={formData.apellidosKanji}
                                                onChange={handleChange}
                                                placeholder="Ej: 田中"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nombresKanji" className="form-label">
                                                NOMBRES: *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nombresKanji"
                                                name="nombresKanji"
                                                value={formData.nombresKanji}
                                                onChange={handleChange}
                                                placeholder="Ej: 太郎"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Personal Info */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="fechaNacimiento" className="form-label">
                                            FECHA DE NACIMIENTO: *
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="fechaNacimiento"
                                            name="fechaNacimiento"
                                            value={formData.fechaNacimiento}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="genero" className="form-label">
                                            HOMBRE / MUJER: *
                                        </label>
                                        <select
                                            className="form-control"
                                            id="genero"
                                            name="genero"
                                            value={formData.genero}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="hombre">Hombre</option>
                                            <option value="mujer">Mujer</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="tipoConyuge" className="form-label">
                                            TIPO DE CÓNYUGE:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tipoConyuge"
                                            name="tipoConyuge"
                                            value={formData.tipoConyuge}
                                            onChange={handleChange}
                                            placeholder="Ej: Permanente, Temporal, etc."
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="direccionActual" className="form-label">
                                            DIRECCIÓN ACTUAL: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="direccionActual"
                                            name="direccionActual"
                                            value={formData.direccionActual}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="personasViviendo" className="form-label">
                                            CON CUANTAS PERSONAS VIVE INCLUYENDO HIJOS: *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="personasViviendo"
                                            name="personasViviendo"
                                            value={formData.personasViviendo}
                                            onChange={handleChange}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="tiempoDireccion" className="form-label">
                                            CUANTO TIEMPO TIENE VIVIENDO EN SU DIRECCIÓN ACTUAL: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tiempoDireccion"
                                            name="tiempoDireccion"
                                            value={formData.tiempoDireccion}
                                            onChange={handleChange}
                                            placeholder="Ej: 2 años, 6 meses"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="cantidadHijos" className="form-label">
                                            CUANTOS HIJOS TIENE:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="cantidadHijos"
                                            name="cantidadHijos"
                                            value={formData.cantidadHijos}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="relacionJefeHogar" className="form-label">
                                            RELACIÓN CON JEFE DE HOGAR:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="relacionJefeHogar"
                                            name="relacionJefeHogar"
                                            value={formData.relacionJefeHogar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="cabezaFamilia" className="form-label">
                                            USTED ES CABEZA DE FAMILIA: *
                                        </label>
                                        <select
                                            className="form-control"
                                            id="cabezaFamilia"
                                            name="cabezaFamilia"
                                            value={formData.cabezaFamilia}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="si">Sí</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="pagoHipotecaAlquiler" className="form-label">
                                            PAGO DE HIPOTECA/ALQUILER: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="pagoHipotecaAlquiler"
                                            name="pagoHipotecaAlquiler"
                                            value={formData.pagoHipotecaAlquiler}
                                            onChange={handleChange}
                                            placeholder="Monto mensual"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="telefonoCasa" className="form-label">
                                            TELÉFONO CASA:
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefonoCasa"
                                            name="telefonoCasa"
                                            value={formData.telefonoCasa}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="telefonoMovil" className="form-label">
                                            TELÉFONO MÓVIL: *
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefonoMovil"
                                            name="telefonoMovil"
                                            value={formData.telefonoMovil}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INFORMACIÓN DEL TRABAJO CLIENTE */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h3 className="card-title mb-0">INFORMACIÓN DEL TRABAJO CLIENTE</h3>
                            </div>
                            <div className="card-body">
                                {/* Empresa Katakana */}
                                <div className="mb-4">
                                    <h5 className="text-success mb-3">
                                        ESCRIBIR EN KATAKANA
                                    </h5>
                                    <div className="mb-3">
                                        <label htmlFor="nombreEmpresaKatakana" className="form-label">
                                            NOMBRE EMPRESA DONDE TRABAJA: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombreEmpresaKatakana"
                                            name="nombreEmpresaKatakana"
                                            value={formData.nombreEmpresaKatakana}
                                            onChange={handleChange}
                                            placeholder="Ej: トヨタ"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Empresa Kanji */}
                                <div className="mb-4">
                                    <h5 className="text-success mb-3">
                                        ESCRIBIR EN KANJI
                                    </h5>
                                    <div className="mb-3">
                                        <label htmlFor="nombreEmpresaKanji" className="form-label">
                                            NOMBRE EMPRESA DONDE TRABAJA: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombreEmpresaKanji"
                                            name="nombreEmpresaKanji"
                                            value={formData.nombreEmpresaKanji}
                                            onChange={handleChange}
                                            placeholder="Ej: トヨタ自動車"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="direccionTrabajo" className="form-label">
                                            DIRECCIÓN DE LUGAR DE TRABAJO: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="direccionTrabajo"
                                            name="direccionTrabajo"
                                            value={formData.direccionTrabajo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="telefonoTrabajo" className="form-label">
                                            TELÉFONO DE LUGAR DE TRABAJO: *
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefonoTrabajo"
                                            name="telefonoTrabajo"
                                            value={formData.telefonoTrabajo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="tipoIndustria" className="form-label">
                                            TIPO DE INDUSTRIA DEL TRABAJO: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tipoIndustria"
                                            name="tipoIndustria"
                                            value={formData.tipoIndustria}
                                            onChange={handleChange}
                                            placeholder="Ej: Manufactura, Servicios, etc."
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="tiempoTrabajando" className="form-label">
                                            CUANTO TIEMPO TIENE TRABAJANDO: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tiempoTrabajando"
                                            name="tiempoTrabajando"
                                            value={formData.tiempoTrabajando}
                                            onChange={handleChange}
                                            placeholder="Ej: 3 años, 5 meses"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="ingresoMensual" className="form-label">
                                            INGRESO MENSUAL: *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="ingresoMensual"
                                            name="ingresoMensual"
                                            value={formData.ingresoMensual}
                                            onChange={handleChange}
                                            placeholder="Monto en yenes"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="ingresoAnual" className="form-label">
                                            INGRESO ANUAL: *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="ingresoAnual"
                                            name="ingresoAnual"
                                            value={formData.ingresoAnual}
                                            onChange={handleChange}
                                            placeholder="Monto en yenes"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="diaPago" className="form-label">
                                            DÍA DE PAGO: *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="diaPago"
                                            name="diaPago"
                                            value={formData.diaPago}
                                            onChange={handleChange}
                                            placeholder="Ej: 25 de cada mes"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="nombreEmpresaContratista" className="form-label">
                                            NOMBRE DE EMPRESA CONTRATISTA:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombreEmpresaContratista"
                                            name="nombreEmpresaContratista"
                                            value={formData.nombreEmpresaContratista}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="direccionEmpresaContratista" className="form-label">
                                            DIRECCIÓN EMPRESA CONTRATISTA:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="direccionEmpresaContratista"
                                            name="direccionEmpresaContratista"
                                            value={formData.direccionEmpresaContratista}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="telefonoEmpresaContratista" className="form-label">
                                            TELÉFONO EMPRESA:
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefonoEmpresaContratista"
                                            name="telefonoEmpresaContratista"
                                            value={formData.telefonoEmpresaContratista}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DOCUMENTOS ADJUNTOS */}
                        <div className="card mb-4">
                            <div className="card-header bg-dark text-white">
                                <h3 className="card-title mb-0">
                                    ADJUNTAR LOS SIGUIENTES DOCUMENTOS
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="alert alert-info">
                                    Por favor adjunte fotos claras de ambos lados de cada documento.
                                </div>

                                {/* Seiru Card - Front and Back */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h6 className="text-primary mb-3">FOTO SEIRU CADO (AMBOS LADOS): *</h6>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="seiruCadoFrontal" className="form-label">
                                            Parte Delantera: *
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="seiruCadoFrontal"
                                            name="seiruCadoFrontal"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        {documents.seiruCadoFrontal && (
                                            <small className="text-success">
                                                Archivo seleccionado: {documents.seiruCadoFrontal.name}
                                            </small>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="seiruCadoTrasera" className="form-label">
                                            Parte Trasera: *
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="seiruCadoTrasera"
                                            name="seiruCadoTrasera"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        {documents.seiruCadoTrasera && (
                                            <small className="text-success">
                                                Archivo seleccionado: {documents.seiruCadoTrasera.name}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                {/* Driver's License - Front and Back */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h6 className="text-primary mb-3">FOTO LICENCIA CONDUCIR (AMBOS LADOS): *</h6>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="licenciaConducirFrontal" className="form-label">
                                            Parte Delantera: *
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="licenciaConducirFrontal"
                                            name="licenciaConducirFrontal"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        {documents.licenciaConducirFrontal && (
                                            <small className="text-success">
                                                Archivo seleccionado: {documents.licenciaConducirFrontal.name}
                                            </small>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="licenciaConducirTrasera" className="form-label">
                                            Parte Trasera: *
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="licenciaConducirTrasera"
                                            name="licenciaConducirTrasera"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        {documents.licenciaConducirTrasera && (
                                            <small className="text-success">
                                                Archivo seleccionado: {documents.licenciaConducirTrasera.name}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="kokuminShakaiHoken" className="form-label">
                                            FOTO DE KOKUMIN O SHAKAI HOKEN: *
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="kokuminShakaiHoken"
                                            name="kokuminShakaiHoken"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        {documents.kokuminShakaiHoken && (
                                            <small className="text-success">
                                                Archivo seleccionado: {documents.kokuminShakaiHoken.name}
                                            </small>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="libretaBanco" className="form-label">
                                            FOTO DE LIBRETA DE BANCO (NOMBRE EN ESPAÑOL/JAPONÉS Y NÚMERO DE CUENTA): *
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="libretaBanco"
                                            name="libretaBanco"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        {documents.libretaBanco && (
                                            <small className="text-success">
                                                Archivo seleccionado: {documents.libretaBanco.name}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary btn-lg px-5 py-3">
                                Enviar Solicitud de Financiamiento
                            </button>
                            <p className="mt-3 text-muted">
                                POR FAVOR ESCRIBIR BIEN SUS DATOS
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Financiamiento
