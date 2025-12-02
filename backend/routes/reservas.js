/* eslint-disable no-undef */
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')
const verifyToken = require('../midelwares/verifyToken.js')
// GET /api/v1/services/reservas_servicio - Get all service reservations
router.get('/', async (req, res) => {
    try {


        const [body] = await db.query('SELECT * FROM reservas_servicio ORDER BY id DESC')

        responser.success({ res, body })

    } catch (error) {
        console.error('Error fetching service reservations:', error)
        responser.error({ res, message: error?.message || 'Error interno del servidor' })
    }
})

// PUT /api/v1/services/reservas_servicio/:id - Update service reservation status
router.put('/:id', verifyToken, async (req, res) => {
    try {

        var { id } = req.params
        var { status } = req.body

        // Validate status
        if (status === undefined || status === null || ![0, 1, 2, 3].includes(Number(status))) {
            return responser.error({
                res,
                message: 'Estado inválido. Debe ser 0 (Pendiente), 1 (Aprobado), 2 (Cancelado) o 3 (Ejecutado)',
                status: 400
            })
        }

        var [result] = await db.query(
            'UPDATE reservas_servicio SET status = ? WHERE id = ?',
            [Number(status), id]
        )

        if (result.affectedRows === 0) {
            return responser.error({
                res,
                message: 'Reserva de servicio no encontrada',
                status: 404
            })
        }

        responser.success({ res, message: 'Estado del servicio actualizado exitosamente' })

    } catch (error) {
        console.error('Error updating service reservation:', error)
        responser.error({ res, message: error?.message || 'Error interno del servidor' })
    }
})

// POST /api/v1/services/reserve - Save service reservation
router.post('/', async (req, res) => {
    try {
        const { nombre, email, telefono, servicio, fecha_reserva, hora_reserva } = req.body

        // Validate required fields
        if (!nombre || !email || !telefono || !servicio || !fecha_reserva || !hora_reserva) {
            return responser.error({
                res,
                message: 'Todos los campos son requeridos',
                status: 400
            })
        }


        // Insert the reservation
        const query = `
      INSERT INTO reservas_servicio (nombre, email, telefono, servicio, fecha_reserva, hora_reserva)
      VALUES (?, ?, ?, ?, ?, ?)
    `
        const [result] = await db.query(query, [nombre, email, telefono, servicio, fecha_reserva, hora_reserva])

        if (result.affectedRows === 0) {
            return responser.error({
                res,
                message: 'No se pudo guardar la reserva',
                status: 500
            })
        }

        return responser.success({
            res,
            body: {
                id: result.insertId,
            },
            message: 'Reserva guardada exitosamente'
        })
    } catch (error) {
        console.error('Error saving service reservation:', error)
        return responser.error({
            res,
            message: error?.message || 'Error interno del servidor',
            status: 500
        })
    }
})

module.exports = router
