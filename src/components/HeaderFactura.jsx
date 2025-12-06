const HeaderFactura = ({ id }) => {
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
                    Email:sanocars@hotmail.com
                    担当者：サンチェス <br />
                    お支払金融機関名 / お支払期限日】<br />
                    静岡銀行  広見支店<br />
                    (普通預金) 0596664 カ）サノカーズ<br />
                    お支払期限日： 一週間<br />
                </div>
            </div>
        </div>
    )
}

export default HeaderFactura