/* eslint-disable no-undef */

var express = require("express")
var users = require("./routes/users.js")
var auth = require("./routes/auth.js")
var vehicles = require("./routes/vehicles.js")
var visits = require("./routes/visits.js")
var services = require("./routes/services.js")
var financing = require("./routes/financing.js")
var inventory = require("./routes/inventory.js")
var inspeccionVehicular = require("./routes/inspeccionVehicular.js")
var facturas = require("./routes/facturas.js")
var informeVehiculos = require("./routes/informeVehiculos.js")
var categoriasServicio = require("./routes/categoriasServicio.js")
var configuracion = require("./routes/configuracion.js")
var route = express.Router()

var router = (app) => {
    app.use('/api/v1', route)
    route.use('/users', users)
    route.use('/auth', auth)
    route.use('/vehicles', vehicles)
    route.use('/visits', visits)
    route.use('/services', services)
    route.use('/financing', financing)
    route.use('/inventory', inventory)
    route.use('/inspeccion-vehicular', inspeccionVehicular)
    route.use('/facturas', facturas)
    route.use('/informe-vehiculos', informeVehiculos)
    route.use('/categorias-servicio', categoriasServicio)
    route.use('/configuracion', configuracion)
    // Ruta por defecto: 404 Not Found
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found', message: 'La ruta solicitada no existe' })
    })
}

module.exports = router
