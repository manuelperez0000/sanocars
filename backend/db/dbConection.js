/* eslint-disable no-undef */
// db.js
var mysql = require('mysql2/promise');
require('dotenv').config();

async function initDb() {
  try {
    var pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });

    // Comprobación inmediata
    var conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    console.log(`✅ Conectado a la base de datos ${process.env.DB_NAME}`);
    return pool;
  } catch (err) {
    console.error('❌ Fallo al conectar a la base de datos:', err.message);
    return null;
  }
}

module.exports = initDb;



/* const dbSaoanocars = {
  host:"173.208.213.194",
  dbName:"sanocars_taller",
  user:"sanocars_taller123",
  password:"B^nayBd%w~CTtfQ9",
  port:3306,
} */

//para conexiones sin ip
//192.68.0%
