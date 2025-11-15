/* eslint-disable no-undef */
var express = require("express")
var upload = require("./routes/upload.js")
var users = require("./routes/users.js")
var route = express.Router()

function router(app){
    app.use('/api/v1', route)
    route.use('/upload', upload)
    route.use('/users', users)
}

module.exports = router
