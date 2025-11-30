/* eslint-disable no-undef */
var dotenv = require("dotenv");
dotenv.config();

const connect = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}


module.exports = connect