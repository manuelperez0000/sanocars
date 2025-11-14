/* eslint-disable no-undef */
require('dotenv').config();
var mysql = require('mysql2');

var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

var promisePool = pool.promise();

module.exports = promisePool;

/* const dbSaoanocars = {
  host:"173.208.213.194",
  dbName:"sanocars_taller",
  user:"sanocars_asdasd",
  password:"UXcwOeOD&U*op=42",
  port:3306,
} */
//192.68.0%

//host2 : sanocarstaller.com