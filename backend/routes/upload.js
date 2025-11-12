/* eslint-disable no-undef */
var express = require('express')
var multer = require('multer')
var path = require('path')
var fs = require('fs')

var router = express.Router()

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

var upload = multer({ storage: storage })

// Upload endpoint
// Accepts field 'image' (multipart/form-data)
router.post('/', upload.single('image'), function (req, res) {
  if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' })
  res.json({ message: 'Imagen subida correctamente', filename: req.file.filename })
})

// Optional: list uploads
router.get('/', function (req, res) {
  try {
    var files = fs.readdirSync(uploadsDir)
    res.json({ files: files })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error al leer carpeta uploads' })
  }
})

module.exports = router
