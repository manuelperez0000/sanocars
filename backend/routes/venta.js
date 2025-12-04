/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/venta - Get all sales
router.get('/', async (req, res) => {
  try {
    
    var [rows] = await db.query('SELECT * FROM venta ORDER BY id DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching sales:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// GET /api/v1/venta/:id - Get sale by id
router.get('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM venta WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Venta no encontrada', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching sale by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// POST /api/v1/venta - Create a new sale
router.post('/', async (req, res) => {
  try {
    
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    // Extract fields from request body
    var tipo = req?.body?.tipo || null
    var vehiculo_id = req?.body?.vehiculo_id || null
    var producto_id = req?.body?.producto_id || null
    var cliente_nombre = req?.body?.cliente_nombre || null
    var cliente_apellido = req?.body?.cliente_apellido || null
    var cliente_email = req?.body?.cliente_email || null
    var cliente_telefono = req?.body?.cliente_telefono || null
    var cliente_direccion = req?.body?.cliente_direccion || null
    var precio_venta = req?.body?.precio_venta || 0
    var tipo_pago = req?.body?.tipo_pago || null
    var numero_cuotas = req?.body?.numero_cuotas || null
    var frecuencia_cuotas = req?.body?.frecuencia_cuotas || null
    var monto_inicial = req?.body?.monto_inicial || 0
    var tasa_interes = req?.body?.tasa_interes || 0
    var total_con_intereses = req?.body?.total_con_intereses || precio_venta
    var datos_pago = req?.body?.datos_pago || null
    var fecha_inicial = req?.body?.fecha_inicial || null
    var siguientes_pagos = req?.body?.siguientes_pagos || null
    var informacion_garantia = req?.body?.informacion_garantia || null

    //add tatus to siguientes pagos 
    if (siguientes_pagos && Array.isArray(siguientes_pagos)) {
      siguientes_pagos = siguientes_pagos.map(pago => ({
        ...pago,
        status: false
      }))
    }else{
      siguientes_pagos = JSON.parse(siguientes_pagos || '[]').map(pago => ({
        ...pago,
        status: false
      }))
    }

    siguientes_pagos = JSON.stringify(siguientes_pagos)

    // Validate required fields
    if (!tipo || !cliente_nombre || !precio_venta || !tipo_pago) {
      return responser.error({ res, message: 'Tipo, nombre del cliente, precio de venta y tipo de pago son requeridos', status: 400 })
    }

    // Validate tipo
    const validTipos = ['vehiculo', 'producto']
    if (!validTipos.includes(tipo)) {
      return responser.error({ res, message: 'Tipo debe ser vehiculo o producto', status: 400 })
    }

    // Validate tipo_pago
    const validTiposPago = ['contado', 'cuotas','financiamiento japones']
    if (!validTiposPago.includes(tipo_pago)) {
      return responser.error({ res, message: 'Tipo de pago debe ser contado o cuotas', status: 400 })
    }

    // Validate frecuencia_cuotas if tipo_pago is cuotas
    if (tipo_pago === 'cuotas') {
      const validFrecuencias = ['semanal', 'quincenal', 'mensual']
      if (!frecuencia_cuotas || !validFrecuencias.includes(frecuencia_cuotas)) {
        return responser.error({ res, message: 'Frecuencia de cuotas debe ser semanal, quincenal o mensual', status: 400 })
      }
      if (!numero_cuotas || numero_cuotas < 1) {
        return responser.error({ res, message: 'Número de cuotas debe ser mayor a 0', status: 400 })
      }
    }

    // Insert query
    var insertQuery = `INSERT INTO venta (tipo, vehiculo_id, producto_id, cliente_nombre, cliente_apellido,cliente_email, cliente_telefono, cliente_direccion, precio_venta,tipo_pago, numero_cuotas, frecuencia_cuotas, monto_inicial,tasa_interes, total_con_intereses, fecha_inicial, siguientes_pagos, datos_pago, informacion_garantia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    var params = [
      tipo, vehiculo_id, producto_id, cliente_nombre, cliente_apellido,
      cliente_email, cliente_telefono, cliente_direccion, precio_venta,
      tipo_pago, numero_cuotas, frecuencia_cuotas, monto_inicial,
      tasa_interes, total_con_intereses, fecha_inicial, siguientes_pagos, datos_pago, informacion_garantia
    ]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear la venta', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM venta WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Venta creada', status: 201 })

  } catch (error) {
    console.error('Error creating sale:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/venta/:id - Update sale
router.put('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'tipo', 'vehiculo_id', 'producto_id', 'cliente_nombre', 'cliente_apellido',
      'cliente_email', 'cliente_telefono', 'cliente_direccion', 'precio_venta',
      'tipo_pago', 'numero_cuotas', 'frecuencia_cuotas', 'monto_inicial',
      'tasa_interes', 'total_con_intereses', 'fecha_inicial', 'siguientes_pagos', 'datos_pago', 'informacion_garantia'
    ]

    var updates = []
    var params = []
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      if (req.body[f] !== undefined) {
        // Validate tipo if being updated
        if (f === 'tipo') {
          const validTipos = ['vehiculo', 'producto']
          if (!validTipos.includes(req.body[f])) {
            return responser.error({ res, message: 'Tipo debe ser vehiculo o producto', status: 400 })
          }
        }
        // Validate tipo_pago if being updated
        if (f === 'tipo_pago') {
          const validTiposPago = ['contado', 'cuotas']
          if (!validTiposPago.includes(req.body[f])) {
            return responser.error({ res, message: 'Tipo de pago debe ser contado o cuotas', status: 400 })
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
    var sql = 'UPDATE venta SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Venta no encontrada', status: 404 })
    }

    var [rows] = await db.query('SELECT * FROM venta WHERE id = ? LIMIT 1', [id])
    return responser.success({ res, body: rows[0], message: 'Venta actualizada' })

  } catch (error) {
    console.error('Error updating sale:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/venta/:id - Delete sale
router.delete('/:id', async (req, res) => {
  try {
    
    var { id } = req.params

    var [result] = await db.query('DELETE FROM venta WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Venta no encontrada', status: 404 })
    }

    return responser.success({ res, message: 'Venta eliminada exitosamente' })

  } catch (error) {
    console.error('Error deleting sale:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
