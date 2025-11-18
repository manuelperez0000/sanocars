/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var express = require('express')
var multer = require('multer')
var path = require('path')
var fs = require('fs')
var dotenv = require('dotenv')
var cors = require('cors');
var allowedOrigins = require('./allowedOrigins.json')
var rateLimit = require('express-rate-limit')

dotenv.config()

var app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (ej. curl, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('No autorizado por CORS'))
    }
  }
}))

var uploadLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 20,                  // máximo 20 peticiones
  message: { error: 'Has alcanzado el límite de 20 imágenes cada 30 minutos' }
})

function checkOrigin(req, res, next) {
  var origin = req.headers.origin
  if (!origin || allowedOrigins.includes(origin)) {
    return next()
  }
  return res.status(403).json({ error: 'Acceso denegado' })
}

// Ensure uploads directory
var uploadsDir = path.join(__dirname, 'uploads')
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

var upload = multer({ storage: storage })

// Health
app.get('/', function (req, res) {
  res.json({ status: 'ok', message: 'API de subida de imágenes funcionando' })
})

// Upload endpoint
// Accepts field 'image' (multipart/form-data)
app.post('/upload', uploadLimiter, checkOrigin, upload.single('image'), function (req, res) {
  if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' })
  res.json({ message: 'Imagen subida correctamente', filename: req.file.filename })
})

// Optional: list uploads
app.get('/uploads', function (req, res) {
  try {
    var files = fs.readdirSync(uploadsDir)
    res.json({ files: files })
  } catch (err) {
    res.status(500).json({ error: 'Error al leer carpeta uploads' })
  }
})

// 🔥 Nuevo endpoint: eliminar imagen por nombre
app.delete('/upload/:imageUrl', checkOrigin, function (req, res) {
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

var rawPort = process.env.PORT
var PORT = rawPort ? Number(rawPort) : 3000
if (isNaN(PORT) || PORT <= 0) {
  console.error('La variable PORT no es válida: ' + rawPort)
  process.exit(1)
}

app.listen(PORT, function () {
  console.log('Servidor corriendo en puerto ' + PORT)
})
