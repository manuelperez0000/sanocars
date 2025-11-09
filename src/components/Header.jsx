import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'

const Header = ({ onSearch }) => {
    return (
        <header className="home-header text-white d-flex align-items-center">
            <div className="container">
                <div className="row">

                    <div className="d-flex justify-content-between align-items-center py-3">
                        <div className="logo d-flex align-items-center gap-3">
                            <img src="/logo192.png" alt="logo" style={{ width: 48, height: 48 }} />
                            <strong className="fs-4">SanoCars</strong>
                        </div>
                        <nav>
                            <ul className="nav">
                                <li className="nav-item"><NavLink className="nav-link text-white" to="/">Inicio</NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link text-white" to="/financiamiento">Financiamiento</NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link text-white" to="/contacto">Contacto</NavLink></li>
                                <li className="nav-item ms-3"><button className="btn btn-outline-light btn-sm">Área de clientes</button></li>
                            </ul>
                        </nav>
                    </div>

                    <div className="row align-items-center py-5">
                        <div className="col-md-7 text-md-start text-center">
                            <h1 className="display-5 fw-bold">Encuentra el vehículo de tus sueños</h1>
                            <p className="lead">Compra y vende autos con confianza — ofertas, financiamiento y más.</p>
                            <div className="mt-4">
                                <SearchBar onSearch={onSearch} />
                            </div>
                        </div>
                        <div className="col-md-5 d-none d-md-block">
                            {/* espacio para ilustración si se desea */}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
