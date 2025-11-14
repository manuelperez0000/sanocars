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

// Database initialization (MySQL using mysql2/promise)
// Environment variables expected: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
var dbPool = null

async function initDb() {
  let mysql
  try {
    mysql = require('mysql2/promise')
  } catch (e) {
    console.warn('Paquete "mysql2" no está instalado. Si desea usar MySQL, instale: npm install mysql2', e && e.message ? e.message : '')
    return
  }

  var DB_HOST = process.env.DB_HOST || '127.0.0.1'
  var DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  var DB_USER = process.env.DB_USER || 'root'
  var DB_PASSWORD = process.env.DB_PASSWORD || ''
  var DB_NAME = process.env.DB_NAME || ''

  try {
    dbPool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    })
utf8mb4_general_ci
    // quick check: get a connection and ping
    const conn = await dbPool.getConnection()
    await conn.ping()
    conn.release()

    app.locals.db = dbPool
    console.log(`Base de datos conectada correctamente a ${DB_HOST}:${DB_PORT}/${DB_NAME}`)
  } catch (err) {
    console.error('Error conectando a la base de datos:', err && err.message ? err.message : err)
    // no hacemos process.exit para permitir que la API siga corriendo en modo degradado,
    // pero puede decidirse lo contrario si la app requiere DB.
  }
}

var rawPort = process.env.PORT
var PORT = rawPort ? Number(rawPort) : 3000
if (isNaN(PORT) || PORT <= 0) {
  console.error('La variable PORT no es válida: ' + rawPort)
  process.exit(1)
}

async function main() {
  await initDb()

  app.listen(PORT, function () {
    console.log('Servidor corriendo en puerto ' + PORT)
  })
}

main().catch(err => {
  console.error('Error en la inicialización del servidor:', err)
  process.exit(1)
})
