/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')
var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')


// POST /api/v1/auth/login
router.post('/login', async function (req, res) {

  try {
    
    if (!db) { return res.status(500).json({ success: false, error: 'Database not connected in login' }) }

    var email = req.body.email
    var password = req.body.password

    console.log(email, password)
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email y password son requeridos' })

    var [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    if (!rows || rows.length === 0) return res.status(401).json({ success: false, error: 'Credenciales inválidas' })

    var user = rows[0]

    var storedPassword = user.password || null
    if (!storedPassword) {
      console.error('Auth login: user has no stored password', { userId: user.id })
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' })
    }

    var valid = false
    try {
      valid = await bcrypt.compare(password, storedPassword)
    } catch (cmpErr) {
      console.error('Auth bcrypt compare error:', cmpErr)
      return res.status(500).json({ success: false, error: 'Error interno al verificar credenciales' })
    }

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

    db.end();

    return res.json({ success: true, data: { user: user, token: token } })
  } catch (err) {
    console.error('Auth login error:', err)
    res.status(500).json({ success: false, error: err?.message || 'Error interno del servidor' })
  } finally {
    // Close fallback direct connection to avoid leaking connections
    try {
      if (usedFallback && db && typeof db.end === 'function') {
        await db.end()
        console.warn('Auth: closed fallback DB connection')
      }
    } catch (closeErr) {
      console.warn('Auth: error closing fallback DB connection', closeErr)
    }
  }
})

module.exports = router
