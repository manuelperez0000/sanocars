/* eslint-disable no-undef */
var db = require('../db/dbConection.js')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/services/reservas_servicio - Get all service reservations
router.get('/:marca/:modelo', async (req, res) => {
    try {
        const marca = req.params.marca
        const modelo = req.params.modelo

        const query = `SELECT * FROM vehiculos_venta WHERE marca = ? AND modelo = ? ORDER BY id DESC`

        const [body] = await db.query(query, [marca, modelo])

        responser.success({ res, body })

    } catch (error) {
        console.error('Error fetching vehicles:', error)
        responser.error({ res, message: error?.message || 'Error al intentar buscar este vehiculo' })
    }
})

module.exports = router
