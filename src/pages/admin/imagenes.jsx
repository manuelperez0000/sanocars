import {  topurl } from '../../utils/globals'
import { useImagenes } from '../../hooks/useImagenes'

const Imagenes = () => {

  const { preview, setPreview,
    handleFile, setFile,
    handleUpload, status, setStatus,
    progress, setProgress, images,
    loading,
    error, handleDelete } = useImagenes()

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card p-4">
            <h5 className="mb-3">Subir imagen</h5>
            <div className="mb-3">
              <input name="imagen" id="imagen" type="file" accept="image/*" onChange={handleFile} className="form-control" />
            </div>

            {preview && (
              <div className="mb-3">
                <img src={preview} alt="preview" style={{ maxWidth: 320, borderRadius: 8 }} />
              </div>
            )}

            <div className="mb-3">
              <button className="btn btn-warning me-2" onClick={handleUpload}>Subir</button>
              <button className="btn btn-outline-secondary" onClick={() => { setFile(null); setPreview(null); setProgress(0); setStatus(null) }}>Limpiar</button>
            </div>

            <div>
              <div className="progress mb-2" style={{ height: 8 }}>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
              </div>

              {status && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {status.message}
                </div>
              )}
            </div>
          </div>
        </div>

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
                          src={`${topurl}/uploads/${imageName}`}
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
