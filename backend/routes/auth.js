/* eslint-disable no-undef */
var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

var bcrypt = require('bcryptjs')
var connect = require('../db/connect.js')
var mysql = require('mysql2/promise')

// POST /api/v1/auth/login
router.post('/login', async function (req, res) {
  try {
  const db = await mysql.createConnection(connect)
  if (!db) return res.status(500).json({ success: false, error: 'Database not connected' })

    var email = req.body.email
    var password = req.body.password

    console.log(email, password)
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email y password son requeridos' })

    var [rows] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    if (!rows || rows.length === 0) return res.status(401).json({ success: false, error: 'Credenciales inválidas' })

    var user = rows[0]

    var storedPassword = user.password
    var valid = await bcrypt.compare(password, storedPassword)

    if (!valid) return res.status(401).json({ success: false, error: 'Credenciales inválidas' })

    var payload = {
      id: user.id,
      email: user.email,
      role: user.role || null
    }
    
    var secret = process.env.JWT_SECRET || 'change_this_secret'
    var token = jwt.sign(payload, secret, { expiresIn: '8h' })

    // Do not return password or sensitive fields
    delete user.password
    delete user.pass
    delete user.password_hash

    res.json({ success: true, data: { user: user, token: token } })
  } catch (err) {
    console.error('Auth login error:', err)
    res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
})

module.exports = router
