/* eslint-disable no-undef */
 var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/informe-vehiculos - Get all vehicle inspection reports
router.get('/', async (req, res) => {
  try {
    
    var [rows] = await db.query('SELECT * FROM informe_vehiculos ORDER BY id DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching vehicle inspection reports:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/informe-vehiculos - Create a new vehicle inspection report
router.post('/', async (req, res) => {
  try {
    
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var fecha_ingreso = req.body.fecha_ingreso || null
    var cliente_nombre = req.body.cliente_nombre || null
    var cliente_telefono = req.body.cliente_telefono || null
    var cliente_email = req.body.cliente_email || null
    var vehiculo_marca = req.body.vehiculo_marca || null
    var vehiculo_modelo = req.body.vehiculo_modelo || null
    var vehiculo_motor = req.body.vehiculo_motor || null
    var vehiculo_anio = req.body.vehiculo_anio || null
    var vehiculo_color = req.body.vehiculo_color || null
    var vehiculo_kilometraje = req.body.vehiculo_kilometraje || null
    var vehiculo_fecha_shaken = req.body.vehiculo_fecha_shaken || null
    var vehiculo_estado_bateria = req.body.vehiculo_estado_bateria || null
    var vehiculo_estado_aceite = req.body.vehiculo_estado_aceite || null
    var vehiculo_estado_liquido_frenos = req.body.vehiculo_estado_liquido_frenos || null
    var vehiculo_porcentaje_pastillas_freno = req.body.vehiculo_porcentaje_pastillas_freno || 0
    var vehiculo_porcentaje_neumaticos = req.body.vehiculo_porcentaje_neumaticos || null
    var vehiculo_estado_liquido_refrigerante = req.body.vehiculo_estado_liquido_refrigerante || null
    var vehiculo_detalles_pintura = req.body.vehiculo_detalles_pintura || null
    var vehiculo_observacion_general = req.body.vehiculo_observacion_general || null
    var vehiculo_imagen = req.body.vehiculo_imagen || null
    var vehiculo_foto_documentos = req.body.vehiculo_foto_documentos || null
    var vehiculo_trabajos_realizar = req.body.vehiculo_trabajos_realizar || null

    // Basic required fields
    if (!fecha_ingreso || !cliente_nombre || !vehiculo_marca || !vehiculo_modelo || !vehiculo_anio || !vehiculo_color) {
      return responser.error({ res, message: 'Fecha de ingreso, nombre del cliente, marca, modelo, año y color del vehículo son requeridos', status: 400 })
    }

    var insertQuery = 'INSERT INTO informe_vehiculos (fecha_ingreso, cliente_nombre, cliente_telefono, cliente_email, vehiculo_marca, vehiculo_modelo, vehiculo_motor, vehiculo_anio, vehiculo_color, vehiculo_kilometraje, vehiculo_fecha_shaken, vehiculo_estado_bateria, vehiculo_estado_aceite, vehiculo_estado_liquido_frenos, vehiculo_porcentaje_pastillas_freno, vehiculo_porcentaje_neumaticos, vehiculo_estado_liquido_refrigerante, vehiculo_detalles_pintura, vehiculo_observacion_general, vehiculo_imagen, vehiculo_foto_documentos, vehiculo_trabajos_realizar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var params = [fecha_ingreso, cliente_nombre, cliente_telefono, cliente_email, vehiculo_marca, vehiculo_modelo, vehiculo_motor, vehiculo_anio, vehiculo_color, vehiculo_kilometraje, vehiculo_fecha_shaken, vehiculo_estado_bateria, vehiculo_estado_aceite, vehiculo_estado_liquido_frenos, vehiculo_porcentaje_pastillas_freno, vehiculo_porcentaje_neumaticos, vehiculo_estado_liquido_refrigerante, vehiculo_detalles_pintura, vehiculo_observacion_general, vehiculo_imagen, vehiculo_foto_documentos, vehiculo_trabajos_realizar]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear el informe de vehículo', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM informe_vehiculos WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Informe de vehículo creado', status: 201 })

  } catch (error) {
    console.error('Error creating vehicle inspection report:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/informe-vehiculos/:id - Get vehicle inspection report by id
router.get('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM informe_vehiculos WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Informe de vehículo no encontrado', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching vehicle inspection report by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/informe-vehiculos/:id - Update vehicle inspection report
router.put('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'fecha_ingreso', 'cliente_nombre', 'cliente_telefono', 'cliente_email',
      'vehiculo_marca', 'vehiculo_modelo', 'vehiculo_motor', 'vehiculo_anio', 'vehiculo_color',
      'vehiculo_kilometraje', 'vehiculo_fecha_shaken', 'vehiculo_estado_bateria', 'vehiculo_estado_aceite',
      'vehiculo_estado_liquido_frenos', 'vehiculo_porcentaje_pastillas_freno', 'vehiculo_porcentaje_neumaticos',
      'vehiculo_estado_liquido_refrigerante', 'vehiculo_detalles_pintura', 'vehiculo_observacion_general',
      'vehiculo_imagen', 'vehiculo_foto_documentos', 'vehiculo_trabajos_realizar'
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
    var sql = 'UPDATE informe_vehiculos SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Informe de vehículo no encontrado', status: 404 })
    }

    var [rows] = await db.query('SELECT * FROM informe_vehiculos WHERE id = ? LIMIT 1', [id])
    return responser.success({ res, body: rows[0], message: 'Informe de vehículo actualizado' })

  } catch (error) {
    console.error('Error updating vehicle inspection report:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/informe-vehiculos/:id - Delete vehicle inspection report
router.delete('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    var [result] = await db.query('DELETE FROM informe_vehiculos WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Informe de vehículo no encontrado', status: 404 })
    }

    return responser.success({ res, message: 'Informe de vehículo eliminado' })

  } catch (error) {
    console.error('Error deleting vehicle inspection report:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
