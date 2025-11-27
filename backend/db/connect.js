/* eslint-disable no-undef */

var connect = (req, res) => {
    var db = req.app.locals.db
    if (!db) {
        return res.status(500).json({ error: 'Database not connected' })
    }
    return db
}

module.exports = connect