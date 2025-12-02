/* eslint-disable no-undef */
var express = require("express");
var cors = require("cors");
var router = require("./router.js");
var dotenv = require("dotenv");
var morgan = require("morgan");
var app = express();
const PORT = process.env.PORT || 3000

dotenv.config();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(morgan("dev"))

// Health
app.get('/', async (req, res) => {
  res.json({ status: 'ok', message: 'API FUNCIONA CORRECTAMENTE' })
})

// Routes
router(app)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});