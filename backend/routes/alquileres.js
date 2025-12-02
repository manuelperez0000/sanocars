/* eslint-disable no-undef */
 var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/alquileres - Get all rentals
router.get('/', async (req, res) => {
  try {
    
    var [rows] = await db.query(`
      SELECT a.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM alquileres a
      LEFT JOIN vehiculos_venta v ON a.vehiculo_id = v.id
      ORDER BY a.id DESC
    `)
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching rentals:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/alquileres - Create a new rental
router.post('/', async (req, res) => {
  try {
    
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var vehiculo_id = req.body.vehiculo_id || null
    var cliente_nombre = req.body.cliente_nombre || null
    var cliente_email = req.body.cliente_email || null
    var cliente_telefono = req.body.cliente_telefono || null
    var cliente_direccion = req.body.cliente_direccion || null
    var fecha_inicio = req.body.fecha_inicio || null
    var precio_alquiler = req.body.precio_alquiler || null

    // Basic required fields
    if (!vehiculo_id || !cliente_nombre || !fecha_inicio || !precio_alquiler) {
      return responser.error({ res, message: 'Vehículo, cliente, fecha de inicio y precio son requeridos', status: 400 })
    }

    // Check if vehicle exists and is available for rent
    var [vehicleRows] = await db.query('SELECT * FROM vehiculos_venta WHERE id = ? AND status = "En alquiler"', [vehiculo_id])
    if (!vehicleRows || vehicleRows.length === 0) {
      return responser.error({ res, message: 'Vehículo no encontrado o no disponible para alquiler', status: 400 })
    }

    var insertQuery = 'INSERT INTO alquileres (vehiculo_id, cliente_nombre, cliente_email, cliente_telefono, cliente_direccion, fecha_inicio, precio_alquiler) VALUES (?, ?, ?, ?, ?, ?, ?)'
    var params = [vehiculo_id, cliente_nombre, cliente_email, cliente_telefono, cliente_direccion, fecha_inicio, precio_alquiler]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear el alquiler', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query(`
      SELECT a.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM alquileres a
      LEFT JOIN vehiculos_venta v ON a.vehiculo_id = v.id
      WHERE a.id = ? LIMIT 1
    `, [newId])
    return responser.success({ res, body: rows[0], message: 'Alquiler creado', status: 201 })

  } catch (error) {
    console.error('Error creating rental:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/alquileres/:id - Get rental by id
router.get('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [rows] = await db.query(`
      SELECT a.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM alquileres a
      LEFT JOIN vehiculos_venta v ON a.vehiculo_id = v.id
      WHERE a.id = ? LIMIT 1
    `, [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Alquiler no encontrado', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching rental by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/alquileres/:id - Update rental
router.put('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'vehiculo_id', 'cliente_nombre', 'cliente_email', 'cliente_telefono', 'cliente_direccion', 'fecha_inicio', 'precio_alquiler'
    ]

    var updates = []
    var params = []
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      if (req.body[f] !== undefined) {
        updates.push(f + ' = ?')
        params.push(req.body[f])
      }
    }

    if (updates.length === 0) {
      return responser.error({ res, message: 'No hay campos para actualizar', status: 400 })
    }

    params.push(id)
    var sql = 'UPDATE alquileres SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Alquiler no encontrado', status: 404 })
    }

    var [rows] = await db.query(`
      SELECT a.*, v.marca, v.modelo, v.numero_placa, v.anio
      FROM alquileres a
      LEFT JOIN vehiculos_venta v ON a.vehiculo_id = v.id
      WHERE a.id = ? LIMIT 1
    `, [id])
    return responser.success({ res, body: rows[0], message: 'Alquiler actualizado' })

  } catch (error) {
    console.error('Error updating rental:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/alquileres/:id - Delete rental
router.delete('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [result] = await db.query('DELETE FROM alquileres WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Alquiler no encontrado', status: 404 })
    }
    return responser.success({ res, message: 'Alquiler eliminado' })
  } catch (error) {
    console.error('Error deleting rental:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
