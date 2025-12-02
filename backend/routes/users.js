/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')
var express = require("express")
var router = express.Router()
var responser = require("../network/responser.js")
// GET /api/v1/users - Get all users

router.get('/', async (req, res) => {
  try {

    var [body] = await db.query('SELECT * FROM users ORDER BY id DESC')

    responser.success({ res, body })

  } catch (error) {
    responser.error({ res, message: error?.message || error })
  }
})

// POST /api/v1/users - Create a new user (limited fields)
router.post('/', async (req, res) => {
  try {
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    var name = req.body.name || null
    var lastname = req.body.lastname || null
    var email = req.body.email || null
    var password = req.body.password || null
    var mobile_no = req.body.mobile_no || null
    var role = req.body.role || null
    var nationality = req.body.nationality || null
    var address = req.body.address || null
    var soft_delete = req.body.soft_delete === undefined || req.body.soft_delete === null ? 1 : req.body.soft_delete

    if (!email || !password) {
      return responser.error({ res, message: 'Email y password son requeridos', status: 400 })
    }

    // check existing email
    var [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
    if (existing && existing.length > 0) {
      return responser.error({ res, message: 'El email ya está registrado', status: 409 })
    }

    // try to hash password if bcryptjs is available
    var bcrypt
    try {
      bcrypt = require('bcryptjs')
    } catch (err) {
      bcrypt = null
      void err
    }

    var storedPassword = password
    if (bcrypt) {
      try {
        storedPassword = await bcrypt.hash(password, 10)
      } catch (e) {
        console.error('Error hashing password:', e)
        storedPassword = password
      }
    }

    // Insert using NOW() for created_at/updated_at
    var [result] = await db.query(
      'INSERT INTO users (nationality,  address, name, lastname, email, password, mobile_no, role, soft_delete, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nationality, address, name, lastname, email, storedPassword, mobile_no, role, soft_delete]
    )

    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear el usuario', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [newId])
    return responser.success({ res, body: rows[0], message: 'Usuario creado', status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/users/:id/restore - Restore a soft-deleted user
router.put('/:id/restore', async (req, res) => {
  try {

    var { id } = req.params

    var [result] = await db.query(
      'UPDATE users SET soft_delete = 1 WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return responser.error({
        status: 404,
        message: 'Usuario no encontrado'
      })
    }

    responser.success({ res, message: 'Usuario reestablecido exitosamente' })

  } catch (error) {
    console.error('Error restoring user:', error)
    responser.error.json({
      status: 500,
      res,
      message: 'Error interno del servidor'
    })
  }
})

// DELETE /api/v1/users/:id - Soft delete a user
router.delete('/:id', async (req, res) => {
  try {

    var { id } = req.params

    var [result] = await db.query(
      'UPDATE users SET soft_delete = 0 WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    })
  }
})

// GET /api/v1/users/:id - Get single user by id
router.get('/:id', async (req, res) => {
  try {

    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('Error fetching user by id:', error)
    res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
})

// PUT /api/v1/users/:id - Update user fields
router.put('/:id', async (req, res) => {
  try {

    var { id } = req.params
    var { name, lastname, nationality, address, email, mobile_no, role } = req.body

    // Basic validation
    if (!name && !lastname && (nationality === undefined || nationality === null) && !address && !email && !mobile_no && !role) {
      return res.status(400).json({ success: false, error: 'No hay campos para actualizar' })
    }

    var [result] = await db.query(
      'UPDATE users SET name = ?, lastname = ?, nationality = ?, address = ?, email = ?, mobile_no = ?, role = ? WHERE id = ?',
      [name || null, lastname || null, nationality == null ? null : nationality, address || null, email || null, mobile_no || null, role || null, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
    }

    // return updated user
    var [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
})

module.exports = router
