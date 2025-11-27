/* eslint-disable no-undef */
var connect = require('../db/connect.js')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/facturas - Get all invoices
router.get('/', async (req, res) => {
  try {
    var db = connect(req, res)
    var [rows] = await db.execute('SELECT * FROM facturas ORDER BY id DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/facturas - Create a new invoice
router.post('/', async (req, res) => {
  try {
    var db = connect(req, res)
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var tipo = req.body.tipo || null
    var cliente_nombre = req.body.cliente_nombre || null
    var cliente_apellido = req.body.cliente_apellido || null
    var cliente_genero = req.body.cliente_genero || null
    var cliente_email = req.body.cliente_email || null
    var cliente_telefono = req.body.cliente_telefono || null
    var cliente_direccion = req.body.cliente_direccion || null
    var items = req.body.items || null
    var total = req.body.total || 0
    var datos_pago = req.body.datos_pago || null
    var cuotas = req.body.cuotas || null

    // Basic required fields
    if (!tipo || !cliente_nombre || !items || total === null) {
      return responser.error({ res, message: 'Tipo, nombre del cliente, items y total son requeridos', status: 400 })
    }

    var insertQuery = 'INSERT INTO facturas (tipo, cliente_nombre, cliente_apellido, cliente_genero, cliente_email, cliente_telefono, cliente_direccion, items, total, datos_pago, cuotas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var params = [tipo, cliente_nombre, cliente_apellido, cliente_genero, cliente_email, cliente_telefono, cliente_direccion, JSON.stringify(items), total, JSON.stringify(datos_pago), JSON.stringify(cuotas)]

    var [result] = await db.execute(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear la factura', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.execute('SELECT * FROM facturas WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Factura creada', status: 201 })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/facturas/:id - Get invoice by id
router.get('/:id', async (req, res) => {
  try {
    var db = connect(req, res)
    var { id } = req.params
    var [rows] = await db.execute('SELECT * FROM facturas WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Factura no encontrada', status: 404 })
    }

    // Parse JSON fields
    var invoice = rows[0]
    invoice.items = JSON.parse(invoice.items || '[]')
    invoice.datos_pago = JSON.parse(invoice.datos_pago || 'null')
    invoice.cuotas = JSON.parse(invoice.cuotas || 'null')

    return responser.success({ res, body: invoice })
  } catch (error) {
    console.error('Error fetching invoice by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/facturas/:id - Update invoice
router.put('/:id', async (req, res) => {
  try {
    var db = connect(req, res)
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'tipo', 'cliente_nombre', 'cliente_apellido', 'cliente_genero', 'cliente_email',
      'cliente_telefono', 'cliente_direccion', 'items', 'total', 'datos_pago', 'cuotas'
    ]

    var updates = []
    var params = []
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      if (req.body[f] !== undefined) {
        updates.push(f + ' = ?')
        // JSON stringify for JSON fields
        if (['items', 'datos_pago', 'cuotas'].includes(f)) {
          params.push(JSON.stringify(req.body[f]))
        } else {
          params.push(req.body[f])
        }
      }
    }

    if (updates.length === 0) {
      return responser.error({ res, message: 'No hay campos para actualizar', status: 400 })
    }

    params.push(id)
    var sql = 'UPDATE facturas SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.execute(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Factura no encontrada', status: 404 })
    }

    var [rows] = await db.execute('SELECT * FROM facturas WHERE id = ? LIMIT 1', [id])
    var invoice = rows[0]
    invoice.items = JSON.parse(invoice.items || '[]')
    invoice.datos_pago = JSON.parse(invoice.datos_pago || 'null')
    invoice.cuotas = JSON.parse(invoice.cuotas || 'null')

    return responser.success({ res, body: invoice, message: 'Factura actualizada' })

  } catch (error) {
    console.error('Error updating invoice:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/facturas/:id - Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    var db = connect(req, res)
    var { id } = req.params

    var [result] = await db.execute('DELETE FROM facturas WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Factura no encontrada', status: 404 })
    }

    return responser.success({ res, message: 'Factura eliminada' })

  } catch (error) {
    console.error('Error deleting invoice:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
