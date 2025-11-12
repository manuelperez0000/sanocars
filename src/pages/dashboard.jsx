import useDashboard from "../hooks/useDashboard";

const Dashboard = () => {

    const {
        preview, setPreview,
        handleFile, setFile,
        handleUpload, status,setStatus,
        progress, setProgress
    } = useDashboard()

    return (

        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard</h2>
            </div>

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
        </>

    )
}

export default Dashboard