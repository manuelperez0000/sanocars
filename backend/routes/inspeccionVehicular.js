/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/inspeccion-vehicular - Get all vehicle inspections
router.get('/', async (req, res) => {
  try {
    
    var [rows] = await db.query('SELECT * FROM inspeccion_vehicular ORDER BY fecha_creacion DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching vehicle inspections:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/inspeccion-vehicular - Create a new vehicle inspection
router.post('/', async (req, res) => {
  try {
    
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var {
      cliente_tipo,
      cliente_id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      cliente_direccion,
      vehiculo_marca,
      vehiculo_modelo,
      vehiculo_anio,
      vehiculo_color,
      vehiculo_placa,
      vehiculo_fecha_shaken,
      vehiculo_estado_aceite,
      vehiculo_pastillas_freno,
      vehiculo_neumaticos,
      vehiculo_estado_bateria,
      vehiculo_observaciones,
      vehiculo_trabajos_realizar,
      vehiculo_detalles_pintura,
      foto_vehiculo,
      foto_documento
    } = req.body

    // Basic required fields validation
    if (!cliente_tipo || !vehiculo_marca || !vehiculo_modelo || !vehiculo_anio ||
        !vehiculo_color || !vehiculo_placa || !vehiculo_estado_aceite ||
        vehiculo_pastillas_freno === undefined || !vehiculo_estado_bateria) {
      return responser.error({ res, message: 'Campos requeridos faltantes', status: 400 })
    }

    // Validate percentages
    if (vehiculo_pastillas_freno < 1 || vehiculo_pastillas_freno > 100) {
      return responser.error({ res, message: 'Porcentaje de pastillas de freno debe estar entre 1 y 100', status: 400 })
    }
    
    // Validate client type and required fields
    if (cliente_tipo === 'registrado' && !cliente_id) {
      return responser.error({ res, message: 'ID de cliente requerido para cliente registrado', status: 400 })
    }
    if (cliente_tipo === 'nuevo' && (!cliente_nombre)) {
      return responser.error({ res, message: 'Nombre requerido para cliente nuevo', status: 400 })
    }

    var insertQuery = `INSERT INTO inspeccion_vehicular (
      cliente_tipo, cliente_id, cliente_nombre, cliente_email, cliente_telefono, cliente_direccion,
      vehiculo_marca, vehiculo_modelo, vehiculo_anio, vehiculo_color, vehiculo_placa,
      vehiculo_fecha_shaken, vehiculo_estado_aceite, vehiculo_pastillas_freno,
      vehiculo_neumaticos, vehiculo_estado_bateria, vehiculo_observaciones,
      vehiculo_trabajos_realizar, vehiculo_detalles_pintura, foto_vehiculo, foto_documento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    var params = [
      cliente_tipo, cliente_id || null, cliente_nombre || null, cliente_email || null,
      cliente_telefono || null, cliente_direccion || null, vehiculo_marca, vehiculo_modelo,
      vehiculo_anio, vehiculo_color, vehiculo_placa, vehiculo_fecha_shaken || null,
      vehiculo_estado_aceite, vehiculo_pastillas_freno, vehiculo_neumaticos,
      vehiculo_estado_bateria, vehiculo_observaciones || null, vehiculo_trabajos_realizar || null,
      vehiculo_detalles_pintura || null, foto_vehiculo || null, foto_documento || null
    ]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear la inspección', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM inspeccion_vehicular WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Inspección creada exitosamente', status: 201 })

  } catch (error) {
    console.error('Error creating vehicle inspection:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/inspeccion-vehicular/:id - Get vehicle inspection by id
router.get('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM inspeccion_vehicular WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Inspección no encontrada', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching vehicle inspection by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/inspeccion-vehicular/:id - Update vehicle inspection
router.put('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    // Validate percentages if provided
    if (req.body.vehiculo_pastillas_freno !== undefined && (req.body.vehiculo_pastillas_freno < 1 || req.body.vehiculo_pastillas_freno > 100)) {
      return responser.error({ res, message: 'Porcentaje de pastillas de freno debe estar entre 1 y 100', status: 400 })
    }

    var updates = []
    var params = []

    // Build dynamic update query
    var fields = [
      'cliente_tipo', 'cliente_id', 'cliente_nombre', 'cliente_email', 'cliente_telefono', 'cliente_direccion',
      'vehiculo_marca', 'vehiculo_modelo', 'vehiculo_anio', 'vehiculo_color', 'vehiculo_placa',
      'vehiculo_fecha_shaken', 'vehiculo_estado_aceite', 'vehiculo_pastillas_freno',
      'vehiculo_neumaticos', 'vehiculo_estado_bateria', 'vehiculo_observaciones',
      'vehiculo_trabajos_realizar', 'vehiculo_detalles_pintura', 'foto_vehiculo', 'foto_documento'
    ]

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
    var sql = 'UPDATE inspeccion_vehicular SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Inspección no encontrada', status: 404 })
    }

    var [rows] = await db.query('SELECT * FROM inspeccion_vehicular WHERE id = ? LIMIT 1', [id])
    return responser.success({ res, body: rows[0], message: 'Inspección actualizada exitosamente' })

  } catch (error) {
    console.error('Error updating vehicle inspection:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/inspeccion-vehicular/:id - Delete vehicle inspection
router.delete('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    var [result] = await db.query('DELETE FROM inspeccion_vehicular WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Inspección no encontrada', status: 404 })
    }

    return responser.success({ res, message: 'Inspección eliminada exitosamente' })

  } catch (error) {
    console.error('Error deleting vehicle inspection:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
