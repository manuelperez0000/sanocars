/* eslint-disable no-undef */
var connect = require('../db/connect.js')
var mysql = require('mysql2/promise')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/pagos-alquileres - Get all rental payments
router.get('/', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    var [rows] = await db.execute(`
      SELECT pa.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM pagos_alquileres pa
      LEFT JOIN vehiculos_venta v ON pa.vehiculo_id = v.id
      ORDER BY pa.id DESC
    `)

    // Parse JSON fields
    const parsedRows = rows.map(row => ({
      ...row,
      pagos_realizados: row.pagos_realizados ? JSON.parse(row.pagos_realizados) : []
    }))

    responser.success({ res, body: parsedRows })
  } catch (error) {
    console.error('Error fetching rental payments:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/pagos-alquileres - Create a new rental payment record
router.post('/', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var vehiculo_id = req.body.vehiculo_id || null
    var pagos_realizados = req.body.pagos_realizados || null
    var fecha_proximo_pago = req.body.fecha_proximo_pago || null

    // Basic required fields
    if (!vehiculo_id) {
      return responser.error({ res, message: 'ID del vehículo es requerido', status: 400 })
    }

    // Check if vehicle exists
    var [vehicleRows] = await db.execute('SELECT * FROM vehiculos_venta WHERE id = ?', [vehiculo_id])
    if (!vehicleRows || vehicleRows.length === 0) {
      return responser.error({ res, message: 'Vehículo no encontrado', status: 400 })
    }

    var insertQuery = 'INSERT INTO pagos_alquileres (vehiculo_id, pagos_realizados, fecha_proximo_pago) VALUES (?, ?, ?)'
    var params = [vehiculo_id, pagos_realizados ? JSON.stringify(pagos_realizados) : null, fecha_proximo_pago]

    var [result] = await db.execute(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear el registro de pagos', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.execute(`
      SELECT pa.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM pagos_alquileres pa
      LEFT JOIN vehiculos_venta v ON pa.vehiculo_id = v.id
      WHERE pa.id = ? LIMIT 1
    `, [newId])

    // Parse JSON fields
    const parsedRow = {
      ...rows[0],
      pagos_realizados: rows[0].pagos_realizados ? JSON.parse(rows[0].pagos_realizados) : []
    }

    return responser.success({ res, body: parsedRow, message: 'Registro de pagos creado', status: 201 })

  } catch (error) {
    console.error('Error creating rental payment record:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/pagos-alquileres/:id - Get rental payment by id
router.get('/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    var { id } = req.params
    var [rows] = await db.execute(`
      SELECT pa.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM pagos_alquileres pa
      LEFT JOIN vehiculos_venta v ON pa.vehiculo_id = v.id
      WHERE pa.id = ? LIMIT 1
    `, [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Registro de pagos no encontrado', status: 404 })
    }

    // Parse JSON fields
    const parsedRow = {
      ...rows[0],
      pagos_realizados: rows[0].pagos_realizados ? JSON.parse(rows[0].pagos_realizados) : []
    }

    return responser.success({ res, body: parsedRow })
  } catch (error) {
    console.error('Error fetching rental payment by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/pagos-alquileres/vehiculo/:vehiculo_id - Get rental payment by vehicle id
router.get('/vehiculo/:vehiculo_id', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    var { vehiculo_id } = req.params
    var [rows] = await db.execute(`
      SELECT pa.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM pagos_alquileres pa
      LEFT JOIN vehiculos_venta v ON pa.vehiculo_id = v.id
      WHERE pa.vehiculo_id = ? LIMIT 1
    `, [vehiculo_id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Registro de pagos no encontrado para este vehículo', status: 404 })
    }

    // Parse JSON fields
    const parsedRow = {
      ...rows[0],
      pagos_realizados: rows[0].pagos_realizados ? JSON.parse(rows[0].pagos_realizados) : []
    }

    return responser.success({ res, body: parsedRow })
  } catch (error) {
    console.error('Error fetching rental payment by vehicle id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/pagos-alquileres/:id - Update rental payment
router.put('/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    var { id } = req.params
    // Allowed fields to update
    var fields = [
      'vehiculo_id', 'pagos_realizados', 'fecha_proximo_pago'
    ]

    var updates = []
    var params = []
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      if (req.body[f] !== undefined) {
        if (f === 'pagos_realizados') {
          updates.push(f + ' = ?')
          params.push(JSON.stringify(req.body[f]))
        } else {
          updates.push(f + ' = ?')
          params.push(req.body[f])
        }
      }
    }

    if (updates.length === 0) {
      return responser.error({ res, message: 'No hay campos para actualizar', status: 400 })
    }

    params.push(id)
    var sql = 'UPDATE pagos_alquileres SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.execute(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Registro de pagos no encontrado', status: 404 })
    }

    var [rows] = await db.execute(`
      SELECT pa.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM pagos_alquileres pa
      LEFT JOIN vehiculos_venta v ON pa.vehiculo_id = v.id
      WHERE pa.id = ? LIMIT 1
    `, [id])

    // Parse JSON fields
    const parsedRow = {
      ...rows[0],
      pagos_realizados: rows[0].pagos_realizados ? JSON.parse(rows[0].pagos_realizados) : []
    }

    return responser.success({ res, body: parsedRow, message: 'Registro de pagos actualizado' })

  } catch (error) {
    console.error('Error updating rental payment:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/pagos-alquileres/:id - Delete rental payment
router.delete('/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    var { id } = req.params
    var [result] = await db.execute('DELETE FROM pagos_alquileres WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Registro de pagos no encontrado', status: 404 })
    }
    return responser.success({ res, message: 'Registro de pagos eliminado' })
  } catch (error) {
    console.error('Error deleting rental payment:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
