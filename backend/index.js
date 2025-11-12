/* eslint-disable no-undef */
var express = require('express')
var dotenv = require('dotenv')
var cors = require('cors')
var router = require('./router')

/* var dbData = {
  user:"sanocars_taller123",
  pass: "B^nayBd%w~CTtfQ9",
  dbName:"sanocars_taller"
} */

dotenv.config()

var app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routes
router(app)

// Health
app.get('/', function (req, res) {
  res.json({ status: 'ok', message: 'API FUNCIONA CORRECTAMENTE' })
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
