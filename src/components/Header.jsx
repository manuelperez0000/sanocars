import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import Nav from './nav'

const Header = ({ onSearch }) => {
    const images = ['/carousel/venta.jpg','/carousel/1.jpg','/carousel/3.webp',]
    const [currentIndex, setCurrentIndex] = useState(0)
    const [opacity1, setOpacity1] = useState(1)

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out 0.5s before change
            setTimeout(() => {
                setOpacity1(0)
            }, 6700)
            // Change image and fade in at 5s
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % images.length)
                setOpacity1(1)
            }, 7000)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <header className="home-header bg-dark text-white" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className='bg-wrapper'>
                <div className="slide" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${images[currentIndex]})`,
                    transition: 'opacity 0.5s ease',
                    opacity: opacity1,
                    zIndex: 0,
                    pointerEvents: 'none'
                }}>
                </div>
                {/* <div className="slide" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${images[nextIndex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'opacity 1s ease-in-out',
                    opacity: opacity2,
                    zIndex: 0,
                    pointerEvents: 'none'
                }}></div> */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: "linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.3))",
                    zIndex: 1,
                    pointerEvents: 'none'
                }}></div>
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 3 }}>
                <div className="row">
                    <div className="col-12 ">
                        <Nav />
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-12 text-center pt-4">
                        <h1 className="text-header-h1 momo">Encuentra el vehículo de tus sueños</h1>
                        <div className="lead">Te acompañamos en mantenimiento reparación de tu vehiculo.
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
