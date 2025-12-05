/* eslint-disable no-undef */
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/vehicles - Get all vehicles
router.get('/', async (req, res) => {
  try {

    var [rows] = await db.query('SELECT * FROM vehiculos_venta WHERE status != "eliminado" ORDER BY id DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/vehicles - Create a new vehicle
router.post('/', async (req, res) => {
  try {
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var fecha_ingreso = req.body.fecha_ingreso || null
    var fecha_shaken = req.body.fecha_shaken || null
    var origen = req.body.origen || null
    var marca = req.body.marca || null
    var modelo = req.body.modelo || null
    var numero_placa = req.body.numero_placa || null
    var anio = req.body.anio || null
    var kilometraje = req.body.kilometraje || null
    var color = req.body.color || null
    var tipo_vehiculo = req.body.tipo_vehiculo || null
    var tamano_motor = req.body.tamano_motor || null
    var numero_chasis = req.body.numero_chasis || null
    var transmission = req.body.transmission || null
    var passengers = req.body.passengers || null
    var ac = req.body.ac || null
    var observaciones = req.body.observaciones || null
    var trabajos_realizar = req.body.trabajos_realizar || null
    var cambio_aceite = req.body.cambio_aceite || null
    var mantenimiento_general = req.body.mantenimiento_general || null
    var inspeccion_vehicular = req.body.inspeccion_vehicular || null
    var garantia = req.body.garantia || null
    var imagen1 = req.body.imagen1 || null
    var imagen2 = req.body.imagen2 || null
    var precio = req.body.precio || null
    var status = req.body.status || 'En Venta'

    // Validate status
    const validStatuses = ['En Venta', 'En alquiler', 'eliminado', 'vendido', 'alquilado']
    if (!validStatuses.includes(status)) {
      return responser.error({ res, message: 'Status no válido', status: 400 })
    }

    // Basic required fields
    if (!marca || !modelo) {
      return responser.error({ res, message: 'Marca y modelo son requeridos', status: 400 })
    }

    // Use provided fecha_ingreso or current date
    var insertQuery = 'INSERT INTO vehiculos_venta (fecha_ingreso, fecha_shaken, origen, marca, modelo, numero_placa, anio, kilometraje, color, tipo_vehiculo, tamano_motor, numero_chasis, transmission, passengers, ac, observaciones, trabajos_realizar, cambio_aceite, mantenimiento_general, inspeccion_vehicular, garantia, imagen1, imagen2, precio, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var params = [fecha_ingreso, fecha_shaken, origen, marca, modelo, numero_placa, anio, kilometraje, color, tipo_vehiculo, tamano_motor, numero_chasis, transmission, passengers, ac, observaciones, trabajos_realizar, cambio_aceite, mantenimiento_general, inspeccion_vehicular, garantia, imagen1, imagen2, precio, status]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      console.log(result)
      return responser.error({ res, message: 'No se pudo crear el vehículo', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM vehiculos_venta WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Vehículo creado', status: 201 })

  } catch (error) {
    console.error('Error creating vehicle:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/vehicles/:id - Get vehicle by id
router.get('/:id', async (req, res) => {
  try {
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM vehiculos_venta WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Vehículo no encontrado', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching vehicle by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/vehicles/:id - Update vehicle
router.put('/:id', async (req, res) => {
  try {
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'fecha_ingreso', 'fecha_shaken', 'origen', 'marca', 'modelo', 'numero_placa', 'anio', 'kilometraje', 'color', 'tipo_vehiculo', 'tamano_motor', 'numero_chasis', 'transmission', 'passengers', 'ac', 'observaciones', 'trabajos_realizar', 'cambio_aceite', 'mantenimiento_general', 'inspeccion_vehicular', 'garantia', 'imagen1', 'imagen2', 'precio', 'status'
    ]

    var updates = []
    var params = []
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      if (req.body[f] !== undefined) {
        // Validate status if being updated
        if (f === 'status') {
          const validStatuses = ['En Venta', 'En alquiler', 'eliminado', 'vendido', 'alquilado']
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
    var sql = 'UPDATE vehiculos_venta SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Vehículo no encontrado', status: 404 })
    }

    var [rows] = await db.query('SELECT * FROM vehiculos_venta WHERE id = ? LIMIT 1', [id])
    return responser.success({ res, body: rows[0], message: 'Vehículo actualizado' })

  } catch (error) {
    console.error('Error updating vehicle:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
