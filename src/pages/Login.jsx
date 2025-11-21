import useLogin from '../hooks/useLogin'

export default function Login() {

  const { email, password, handleEmail, handlePassword, loading, error, handleSubmit, remember, handleRemember } = useLogin()

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg overflow-hidden border-0">
            <div className="row g-0">
              <div className="col-md-6 d-none d-md-block bg-login-side" style={{ backgroundImage: 'linear-gradient(135deg,#ff7a00,#ff0066)' }}>
                <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-4">
                  <h3 className="fw-bold">Bienvenido a SanoCars</h3>
                  <p className="small">Gestiona tus vehículos, financiamientos y descubre ofertas exclusivas.</p>
                </div>
              </div>
              <div className="col-md-6 p-4">
                <h4 className="mb-3">Área de clientes</h4>
                <p className="text-muted small">Inicia sesión para acceder a tu cuenta.</p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input value={email} type="email" className="form-control form-control-lg" onChange={e => handleEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input value={password} type="password" className="form-control form-control-lg" onChange={e => handlePassword(e.target.value)} placeholder="Ingresa tu contraseña" required />
                    {error && <div className="alert alert-danger">{error}</div>}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" checked={remember} onChange={e => handleRemember(e.target.checked)} />
                      <label className="form-check-label small" htmlFor="remember">Recordarme</label>
                    </div>
                    <a className="small" href="#">¿Olvidaste tu contraseña?</a>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-warning btn-lg" disabled={loading}>
                      {loading ? 'Ingresando...' : 'Entrar'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3 small text-muted">¿No tienes cuenta? <a href="#">Regístrate</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
