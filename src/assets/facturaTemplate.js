export const headerFactura = ({ id, titulo, email='sanocars@hotmail.com' }) => {
    return `<div class="invoice-header">
                    <div class="flex-between">
                        <div class="text-left">
                            <h2>${titulo || "Factura de Servicio"}</h2>
                            <p>Servicio #${id}</p>
                            <div>${new Date().toLocaleDateString('es-VE')} ${new Date().toLocaleTimeString('es-VE')}</div>
                        </div>
                        <div class="japones" style="text-align: right;">
                            （登録番号 T4080101020530) <br/>
                            <h3>株式会社SANOCARS沼津本店</h3>
                            静岡県沼津市井出1165番地3 <br>
                            TEL055-957-2206 / FAX055-957-2207 <br>
                            Email:${email}
                            担当者：サンチェス <br>
                            お支払金融機関名 / お支払期限日】<br>
                            静岡銀行  広見支店<br>
                            (普通預金) 0596664 カ）サノカーズ<br>
                            お支払期限日：  一週間<br>
                        </div>
                    </div>
                </div>`
}

export const headerFactura2 = ({ id, titulo, email='sanocars@hotmail.com' }) => {
    return `<div class="invoice-header">
                    <div class="flex-between">
                        <div class="text-left">
                            <h2>${titulo || "Factura de Servicio"}</h2>
                            <p>Servicio #${id}</p>
                            <div>${new Date().toLocaleDateString('es-VE')} ${new Date().toLocaleTimeString('es-VE')}</div>
                        </div>
                        <div class="japones" style="text-align: right;">
                            <h3>株式会社SANOCARS沼津本店</h3>
                            静岡県沼津市井出1165番地3 <br>
                            TEL055-957-2206 / FAX055-957-2207 <br>
                            Email:${email}
                        </div>
                    </div>
                </div>`
}