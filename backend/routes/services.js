/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/servicios - Get all servicios
router.get('/', async (req, res) => {
  try {
    
    var [rows] = await db.query('SELECT * FROM servicios ORDER BY id DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching servicios:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// GET /api/v1/servicios/:id - Get servicio by id
router.get('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM servicios WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Servicio no encontrado', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching servicio by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// POST /api/v1/servicios - Create a new servicio
router.post('/', async (req, res) => {
  try {
    
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    // Extract fields from request body
    var nombre_cliente = req.body.nombre_cliente || null
    var telefono_cliente = req.body.telefono_cliente || null
    var email_cliente = req.body.email_cliente || null
    var direccion_cliente = req.body.direccion_cliente || null
    var marca_vehiculo = req.body.marca_vehiculo || null
    var modelo_vehiculo = req.body.modelo_vehiculo || null
    var anio_vehiculo = req.body.anio_vehiculo || null
    var placa_vehiculo = req.body.placa_vehiculo || null
    var color_vehiculo = req.body.color_vehiculo || null
    var kilometraje_vehiculo = req.body.kilometraje_vehiculo || null
    var fecha_shaken = req.body.fecha_shaken || null
    var detalles = req.body.detalles || null
    var subtotal = req.body.subtotal || 0
    var iva = req.body.iva || 0
    var total = req.body.total || 0
    var fecha_servicio = req.body.fecha_servicio || null
    var notas = req.body.notas || null
    var fotos = req.body.fotos || null
    var status = req.body.status || 'Pendiente'

    // Validate status
    const validStatuses = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado']
    if (!validStatuses.includes(status)) {
      return responser.error({ res, message: 'Status no válido', status: 400 })
    }

    // Basic required fields
    if (!nombre_cliente || !marca_vehiculo || !modelo_vehiculo || !placa_vehiculo || !fecha_servicio) {
      return responser.error({ res, message: 'Nombre del cliente, marca, modelo, placa del vehículo y fecha del servicio son requeridos', status: 400 })
    }

    // Insert query
    var insertQuery = `INSERT INTO servicios (
      nombre_cliente, telefono_cliente, email_cliente, direccion_cliente,
      marca_vehiculo, modelo_vehiculo, anio_vehiculo, placa_vehiculo,
      color_vehiculo, kilometraje_vehiculo, fecha_shaken, detalles, subtotal, iva, total,
      fecha_servicio, notas, fotos, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    var params = [
      nombre_cliente, telefono_cliente, email_cliente, direccion_cliente,
      marca_vehiculo, modelo_vehiculo, anio_vehiculo, placa_vehiculo,
      color_vehiculo, kilometraje_vehiculo, fecha_shaken, detalles, subtotal, iva, total,
      fecha_servicio, notas, fotos, status
    ]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear el servicio', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM servicios WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Servicio creado', status: 201 })

  } catch (error) {
    console.error('Error creating servicio:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/servicios/:id - Update servicio
router.put('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'nombre_cliente', 'telefono_cliente', 'email_cliente', 'direccion_cliente',
      'marca_vehiculo', 'modelo_vehiculo', 'anio_vehiculo', 'placa_vehiculo',
      'color_vehiculo', 'kilometraje_vehiculo', 'fecha_shaken', 'detalles', 'subtotal', 'iva', 'total',
      'fecha_servicio', 'notas', 'fotos', 'status'
    ]

    var updates = []
    var params = []
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      if (req.body[f] !== undefined) {
        // Validate status if being updated
        if (f === 'status') {
          const validStatuses = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado']
          if (!validStatuses.includes(req.body[f])) {
            return responser.error({ res, message: 'Status no válido', status: 400 })
          }
        }
        updates.push(f + ' = ?')
        params.push(req.body[f])
      }
    }

    if (updates.length === 0) {
      return responser.error({ res, message: 'No hay campos para actualizar', status: 400 })
    }

    params.push(id)
    var sql = 'UPDATE servicios SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Servicio no encontrado', status: 404 })
    }

    var [rows] = await db.query('SELECT * FROM servicios WHERE id = ? LIMIT 1', [id])
    return responser.success({ res, body: rows[0], message: 'Servicio actualizado' })

  } catch (error) {
    console.error('Error updating servicio:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/servicios/:id - Delete servicio
router.delete('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    var [result] = await db.query('DELETE FROM servicios WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Servicio no encontrado', status: 404 })
    }

    return responser.success({ res, message: 'Servicio eliminado exitosamente' })

  } catch (error) {
    console.error('Error deleting servicio:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
