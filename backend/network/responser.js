/* eslint-disable no-undef */
var success = ({ res, message = 'success', body = {}, status = 200 }) => {
    res.status(status).json({
        body,
        message,
        status: 200
    })
}

var error = ({ res, message = "Error desconocido", body = {}, status = 500 }) => {
    res.status(status).json({
        body,
        message,
        status
    })
}

module.exports = { success, error }