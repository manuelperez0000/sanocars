/* eslint-disable no-undef */
var express = require("express");
var cors = require("cors");
var router = require("./router.js");
var initDb = require("./db/dbConection.js")
var dotenv = require("dotenv");
var morgan = require("morgan")
var app = express()
dotenv.config()

morgan("dev")

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Health
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API FUNCIONA CORRECTAMENTE' })
})

// Routes
router(app)

async function connectDb() {
  var db = await initDb();
  var PORT = process.env.PORT || 3000
  if (!db) {
    console.error('⚠️ El servidor arrancó en modo degradado (sin DB)');
  } else {
    app.locals.db = db;
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
  });
}
connectDb();