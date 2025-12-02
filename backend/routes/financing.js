/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser')

var multer = require('multer')
var path = require('path')
var fs = require('fs')

// Ensure uploads directory exists
var uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false)
    }
  }
})

// POST /api/v1/financing
router.post('/', upload.fields([
  { name: 'seiruCadoFrontal', maxCount: 1 },
  { name: 'seiruCadoTrasera', maxCount: 1 },
  { name: 'licenciaConducirFrontal', maxCount: 1 },
  { name: 'licenciaConducirTrasera', maxCount: 1 },
  { name: 'kokuminShakaiHoken', maxCount: 1 },
  { name: 'libretaBanco', maxCount: 1 }
]), async function (req, res) {

  console.log("Entrando en la ruta de financiamiento...");
  try {
    
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    // Get form data
    var formData = req.body

    // Get uploaded file paths
    var seiruCadoFrontal = req.files.seiruCadoFrontal ? req.files.seiruCadoFrontal[0].filename : null
    var seiruCadoTrasera = req.files.seiruCadoTrasera ? req.files.seiruCadoTrasera[0].filename : null
    var licenciaConducirFrontal = req.files.licenciaConducirFrontal ? req.files.licenciaConducirFrontal[0].filename : null
    var licenciaConducirTrasera = req.files.licenciaConducirTrasera ? req.files.licenciaConducirTrasera[0].filename : null
    var kokuminShakaiHoken = req.files.kokuminShakaiHoken ? req.files.kokuminShakaiHoken[0].filename : null
    var libretaBanco = req.files.libretaBanco ? req.files.libretaBanco[0].filename : null

    // Validate required fields
    var requiredFields = [
      'apellidosKatakana', 'nombresKatakana', 'apellidosKanji', 'nombresKanji',
      'fechaNacimiento', 'genero', 'direccionActual', 'personasViviendo',
      'tiempoDireccion', 'cabezaFamilia', 'pagoHipotecaAlquiler', 'telefonoMovil',
      'nombreEmpresaKatakana', 'nombreEmpresaKanji', 'direccionTrabajo',
      'telefonoTrabajo', 'tipoIndustria', 'tiempoTrabajando', 'ingresoMensual',
      'ingresoAnual', 'diaPago'
    ]

    for (var field of requiredFields) {
      if (!formData[field]) {
        return responser.error({ res, message: `Campo requerido faltante: ${field}`, status: 400 })
      }
    }

    // Validate file uploads
    if (!seiruCadoFrontal || !seiruCadoTrasera || !licenciaConducirFrontal || !licenciaConducirTrasera || !kokuminShakaiHoken || !libretaBanco) {
      return responser.error({ res, message: 'Todos los documentos son requeridos', status: 400 })
    }

    // Insert into database
    var insertQuery = `
      INSERT INTO financiamiento (
        apellidos_katakana, nombres_katakana, apellidos_kanji, nombres_kanji,
        fecha_nacimiento, genero, tipo_conyuge, direccion_actual, personas_viviendo,
        tiempo_direccion, cantidad_hijos, relacion_jefe_hogar, cabeza_familia,
        pago_hipoteca_alquiler, telefono_casa, telefono_movil,
        nombre_empresa_katakana, nombre_empresa_kanji, direccion_trabajo,
        telefono_trabajo, tipo_industria, tiempo_trabajando, ingreso_mensual,
        ingreso_anual, dia_pago, nombre_empresa_contratista,
        direccion_empresa_contratista, telefono_empresa_contratista,
        seiru_cado_frontal, seiru_cado_trasero, licencia_conducir_frontal,
        licencia_conducir_trasero, kokumin_shakai_hoken, libreta_banco
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    var params = [
      formData.apellidosKatakana,
      formData.nombresKatakana,
      formData.apellidosKanji,
      formData.nombresKanji,
      formData.fechaNacimiento,
      formData.genero,
      formData.tipoConyuge || null,
      formData.direccionActual,
      parseInt(formData.personasViviendo),
      formData.tiempoDireccion,
      parseInt(formData.cantidadHijos) || 0,
      formData.relacionJefeHogar || null,
      formData.cabezaFamilia,
      formData.pagoHipotecaAlquiler,
      formData.telefonoCasa || null,
      formData.telefonoMovil,
      formData.nombreEmpresaKatakana,
      formData.nombreEmpresaKanji,
      formData.direccionTrabajo,
      formData.telefonoTrabajo,
      formData.tipoIndustria,
      formData.tiempoTrabajando,
      parseFloat(formData.ingresoMensual),
      parseFloat(formData.ingresoAnual),
      formData.diaPago,
      formData.nombreEmpresaContratista || null,
      formData.direccionEmpresaContratista || null,
      formData.telefonoEmpresaContratista || null,
      seiruCadoFrontal,
      seiruCadoTrasera,
      licenciaConducirFrontal,
      licenciaConducirTrasera,
      kokuminShakaiHoken,
      libretaBanco
    ]

    var [result] = await db.query(insertQuery, params)

    if (!result || !result.insertId) {
      return responser.error({ res, message: 'No se pudo crear la solicitud de financiamiento', status: 500 })
    }

    var newId = result.insertId
    var [rows] = await db.query('SELECT * FROM financiamiento WHERE id = ? LIMIT 1', [newId])

    return responser.success({
      res,
      body: rows[0],
      message: 'Solicitud de financiamiento creada exitosamente',
      status: 201
    })

  } catch (error) {
    console.error('Error creating financing request:', error)
    return responser.error({
      res,
      message: error?.message || 'Error interno del servidor',
      status: 500
    })
  }
})

// GET /api/v1/financing - Get all financing requests
router.get('/', async (req, res) => {
  try {
    
    var [rows] = await db.query('SELECT * FROM financiamiento ORDER BY fecha_creacion DESC')
    responser.success({ res, body: rows })
  } catch (error) {
    console.error('Error fetching financing requests:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// GET /api/v1/financing/:id - Get financing request by id
router.get('/:id', async (req, res) => {
  try {
    
    var { id } = req.params
    var [rows] = await db.query('SELECT * FROM financiamiento WHERE id = ? LIMIT 1', [id])
    if (!rows || rows.length === 0) {
      return responser.error({ res, message: 'Solicitud de financiamiento no encontrada', status: 404 })
    }
    return responser.success({ res, body: rows[0] })
  } catch (error) {
    console.error('Error fetching financing request by id:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

// PUT /api/v1/financing/:id/status - Update financing request status
router.put('/:id/status', async (req, res) => {
  try {
    
    var { id } = req.params
    var { status } = req.body

    // Validate status
    var validStatuses = ['pendiente', 'cancelado', 'en tramite', 'realizado']
    if (!validStatuses.includes(status)) {
      return responser.error({ res, message: 'Estado inválido', status: 400 })
    }

    // Check if financing request exists
    var [existing] = await db.query('SELECT id FROM financiamiento WHERE id = ? LIMIT 1', [id])
    if (!existing || existing.length === 0) {
      return responser.error({ res, message: 'Solicitud de financiamiento no encontrada', status: 404 })
    }

    // Update status
    await db.query('UPDATE financiamiento SET status = ? WHERE id = ?', [status, id])

    // Get updated record
    var [rows] = await db.query('SELECT * FROM financiamiento WHERE id = ? LIMIT 1', [id])

    return responser.success({
      res,
      body: rows[0],
      message: 'Estado del financiamiento actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating financing status:', error)
    return responser.error({
      res,
      message: error?.message || 'Error interno del servidor',
      status: 500
    })
  }
})

module.exports = router
