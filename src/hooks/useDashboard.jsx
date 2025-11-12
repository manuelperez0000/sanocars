import { useState } from 'react'
import axios from 'axios'


const useDashboard = () => {

    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState(null)

    const handleFile = (e) => {
        const f = e.target.files[0]

        setFile(f)
        if (f) {
            const url = URL.createObjectURL(f)
            setPreview(url)
        } else {
            setPreview(null)
        }
        setStatus(null)
        setProgress(0)
    }

    const handleUpload = async () => {
        if (!file) return setStatus({ type: 'error', message: 'Selecciona un archivo primero.' })

        setStatus(null)
        setProgress(0)

        const form = new FormData()
        // El backend Node.js con Multer espera el campo 'image'
        form.append('image', file)

        try {
            // Ajusta la URL según dónde esté corriendo tu servidor PHP
            /* const url = "http://localhost:3000/upload" */
            const url = 'http://mitaller.sanocarstaller.com/upload'
            const resp = await axios.post(url, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                        setProgress(pct)
                    }
                }
            })

            // Intenta deducir información útil de la respuesta
            let msg = 'Archivo subido correctamente.'
            if (resp && resp.data) {
                const d = resp.data
                if (d.filename) msg = `Archivo subido: ${d.filename}`
                else if (d.archivo) msg = `Archivo subido: ${d.archivo}`
                else if (d.file) msg = `Archivo subido: ${d.file}`
                else if (d.mensaje) msg = d.mensaje
            }

            setStatus({ type: 'success', message: msg })
            setFile(null)
            setPreview(null)
            setProgress(100)
        } catch (err) {
            // Trata de leer detalle de error de la respuesta del servidor
            let detail = ''
            if (err.response && err.response.data) {
                try { detail = ' - ' + (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) } catch { detail = '' }
            }
            setStatus({ type: 'error', message: `Error en la subida${detail}` })
        }
    }

    return {
        preview, setPreview,
        handleFile, setFile,
        handleUpload, status,setStatus,
        progress, setProgress
    }
}

export default useDashboard
