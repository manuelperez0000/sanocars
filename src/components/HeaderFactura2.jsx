
import useConfiguracion from "../hooks/useConfiguracion"

const HeaderFactura = ({ id }) => {

    const { getEmails } = useConfiguracion()
    
    return (
        <div>
            <div className="flex-between">
                <div className="text-left">
                    <h2>Factura #{id}</h2>
                    <div>{new Date().toLocaleDateString('es-VE')} {new Date().toLocaleTimeString('es-VE')}</div>
                </div>
                <div className="japones" style={{ textAlign: "right" }}>
                    <h3>株式会社SANOCARS沼津本店</h3>
                    静岡県沼津市井出1165番地3 <br />
                    TEL055-957-2206 / FAX055-957-2207 <br />
                    Email:{getEmails()[0] || 'sanocars@hotmail.com'}
                </div>
            </div>
        </div>
    )
}

export default HeaderFactura