/* eslint-disable no-undef */
var connect = require('../db/connect.js')
var mysql = require('mysql2/promise')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/visits - Get and increment visit count
router.get('/', async (req, res) => {
  try {
  const db = await mysql.createConnection(connect)

    // First, check if there's any record in the table
    var [existing] = await db.execute('SELECT COUNT(*) as count FROM vicitas')
    if (existing[0].count === 0) {
      // Insert initial record if table is empty
      await db.execute('INSERT INTO vicitas (contador) VALUES (1)')
      return responser.success({ res, body: { visits: 1 } })
    }

    // Get the current count, increment it, and return the new value
    var [rows] = await db.execute('SELECT contador FROM vicitas LIMIT 1')
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Contador de visitas no encontrado', status: 404 })
    }

    var newCount = rows[0].contador + 1

    // Update the counter
    var [result] = await db.execute('UPDATE vicitas SET contador = ? WHERE contador = ?', [newCount, rows[0].contador])
    if (result.affectedRows === 0) {
      return responser.error({ res, message: 'No se pudo actualizar el contador de visitas', status: 500 })
    }

    return responser.success({ res, body: { visits: newCount } })
  } catch (error) {
    console.error('Error updating visit count:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
