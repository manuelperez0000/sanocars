import SearchBar from './SearchBar'

import Nav from './nav'


const Header = ({ onSearch }) => {
    return (
        <header className="home-header text-white">
            <div className="container">
                <div className="row">
                    <div className="col-12 ">
                        <Nav />
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-12 text-center">
                        <h1 className="text-header-h1 momo">Encuentra el vehículo de tus sueños</h1>
                        <div className="lead">Te acompañamos en mantenimiento reparación y pintura de tu vehiculo.
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <SearchBar onSearch={onSearch} />
                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header
