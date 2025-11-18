/* eslint-disable no-undef */

var express = require("express") 
var users = require("./routes/users.js") 
var auth = require("./routes/auth.js") 
var route = express.Router()

var router = (app) => {
    app.use('/api/v1', route)
    route.use('/users', users)
    route.use('/auth', auth)
    // Ruta por defecto: 404 Not Found
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found', message: 'La ruta solicitada no existe' })
    })
}

module.exports = router
