/* eslint-disable no-undef */
var express = require('express')
var router = express.Router()

var multer = require('multer')
var path = require('path')
var fs = require('fs')
var dotenv = require('dotenv')
/* var allowedOrigins = require('../allowedOrigins.json') */
var rateLimit = require('express-rate-limit')
var responser = require('../network/responser')

dotenv.config()

var uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 10,                  // máximo 10 peticiones
    message: { error: 'Has alcanzado el límite de 10 imágenes cada 10 minutos' }
})

/* function checkOrigin(req, res, next) {
    var origin = req.headers.origin
    if (!origin || allowedOrigins.includes(origin)) {
        return next()
    }
    return res.status(403).json({ error: 'Acceso denegado' })
} */
// Ensure uploads directory
var uploadsDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
// Multer storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        var ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})
var upload = multer({ storage })
// Upload endpoint
// Accepts field 'image' (multipart/form-data)
router.post('/upload', uploadLimiter, upload.single('image'), function (req, res) {
    if (!req.file) return responser.error({ res, message: 'No se subió ninguna imagen' })
    responser.success({ res, message: 'Imagen subida correctamente', body: { filename: req.file.filename } })
})

// Optional: list uploads
router.get('/uploads', function (req, res) {
    try {
        var files = fs.readdirSync(uploadsDir)
        responser.success({ res, body: { files: files } })
    } catch (error) {
        responser.error({ res, message: error?.message || error })
    }
})

// 🔥 Nuevo endpoint: eliminar imagen por nombre
router.delete('/upload/:imageUrl', function (req, res) {
  var imageName = path.basename(req.params.imageUrl) // evita rutas maliciosas
  var imagePath = path.join(uploadsDir, imageName)

  // Validar extensión
  var allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg']

  if (!allowedExt.includes(path.extname(imageName).toLowerCase())) {
    return res.status(400).json({ error: 'Formato de archivo no permitido' })
  }

  fs.unlink(imagePath, function (err) {
    if (err) {
      return res.status(404).json({ error: 'Imagen no encontrada o ya eliminada' })
    }
    res.json({ message: `Imagen ${imageName} eliminada correctamente` })
  })
})

module.exports = router
