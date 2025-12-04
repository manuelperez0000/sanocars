/* eslint-disable no-undef */
var mysql = require('mysql2');
var automatics = require('./automatics.js');
require('dotenv').config();


const pool = mysql.createPool({
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

const conection = pool.promise()
automatics(conection)

module.exports = pool.promise();

