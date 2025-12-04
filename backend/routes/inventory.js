/* eslint-disable no-undef */
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/inventory - Get all inventory items
router.get('/', async (req, res) => {
  try {

    var [rows] = await db.query('SELECT * FROM inventario ORDER BY id DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// POST /api/v1/inventory - Create a new inventory item
router.post('/', async (req, res) => {
  try {
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var nombre = req.body.nombre || null
    var fabricante = req.body.fabricante || null
    var precio = req.body.precio || null
    var cantidad = req.body.cantidad || 0
    var detalle = req.body.detalle || null
    var imagenes = req.body.imagenes || null

    // Basic required fields
    if (!nombre || !fabricante) {
      return responser.error({ res, message: 'Nombre y fabricante son requeridos', status: 400 })
    }

    var insertQuery = 'INSERT INTO inventario (nombre, fabricante, precio, cantidad, detalle, imagenes) VALUES (?, ?, ?, ?, ?, ?)'
    var params = [nombre, fabricante, precio, cantidad, detalle, imagenes]

    var [result] = await db.query(insertQuery, params)
    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear el producto', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM inventario WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Producto creado', status: 201 })

  } catch (error) {
    console.error('Error creating inventory item:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// GET /api/v1/inventory/:id - Get inventory item by id
router.get('/:id', async (req, res) => {
  try {
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM inventario WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Producto no encontrado', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching inventory item by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/inventory/:id - Update inventory item
router.put('/:id', async (req, res) => {
  try {
    var { id } = req.params

    // Allowed fields to update
    var fields = [
      'nombre', 'fabricante', 'precio', 'cantidad', 'detalle', 'imagenes'
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
    var sql = 'UPDATE inventario SET ' + updates.join(', ') + ' WHERE id = ?'
    var [result] = await db.query(sql, params)
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Producto no encontrado', status: 404 })
    }

    var [rows] = await db.query('SELECT * FROM inventario WHERE id = ? LIMIT 1', [id])
    return responser.success({ res, body: rows[0], message: 'Producto actualizado' })

  } catch (error) {
    console.error('Error updating inventory item:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// DELETE /api/v1/inventory/:id - Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    var { id } = req.params

    var [result] = await db.query('DELETE FROM inventario WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'Producto no encontrado', status: 404 })
    }

    return responser.success({ res, message: 'Producto eliminado' })

  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
