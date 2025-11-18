import React, { useState, useEffect } from 'react'
import request from '../../utils/request'

const Imagenes = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await request.get('http://mitaller.sanocarstaller.com/uploads')
      if (response?.data?.files) {
        setImages(response.data.files)
      }
    } catch (err) {
      console.error('Error fetching images:', err)
      setError(err.message || 'Error cargando imágenes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageName) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la imagen "${imageName}"?`)) {
      return
    }

    try {
      await request.delete(`http://mitaller.sanocarstaller.com/upload/${imageName}`)
      // Remove from local state
      setImages(prev => prev.filter(img => img !== imageName))
    } catch (err) {
      console.error('Error deleting image:', err)
      setError(err.message || 'Error eliminando imagen')
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Gestión de Imágenes</h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {images && images.length > 0 ? (
                images.map((imageName) => (
                  <div key={imageName} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className="card h-100">
                      <div className="card-img-container" style={{ height: '150px', overflow: 'hidden' }}>
                        <img
                          src={`http://mitaller.sanocarstaller.com/uploads/${imageName}`}
                          alt={imageName}
                          className="card-img-top w-100 h-100 object-fit-cover"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="card-body p-2">
                        <p className="card-text small text-truncate mb-2" title={imageName}>
                          {imageName}
                        </p>
                        <button
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => handleDelete(imageName)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center p-4">
                  <p>No hay imágenes disponibles</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Imagenes
