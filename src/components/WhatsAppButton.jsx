import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = () => {
    const phoneNumber = "+8108091171993" // Using the same number from the footer
    const message = "Hola, me gustaría obtener más información sobre sus servicios."

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    return (
        <div className="whatsapp-float">
            <button
                className="btn btn-success rounded-circle shadow-lg"
                onClick={handleClick}
                style={{
                    width: '60px',
                    height: '60px',
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1050,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}
                title="Contactar por WhatsApp"
            >
                <FaWhatsapp />
            </button>
        </div>
    )
}

export default WhatsAppButton
