/* eslint-disable no-undef */
var jwt = require('jsonwebtoken')

// Middleware to verify JWT token in Authorization header (Bearer <token>)
module.exports = function verifyToken(req, res, next) {
  var authHeader = req.headers['authorization'] || req.headers['Authorization']
  if (!authHeader) return res.status(401).json({ success: false, error: 'No token provided' })

  var parts = authHeader.split(' ')
  if (parts.length !== 2) return res.status(401).json({ success: false, error: 'Token inválido' })

  var scheme = parts[0]
  var token = parts[1]
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ success: false, error: 'Formato de token inválido' })

  var secret = process.env.JWT_SECRET || 'change_this_secret'
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      console.error('JWT verification error:', err && err.message ? err.message : err)
      return res.status(401).json({ success: false, error: 'Token inválido o expirado' })
    }

    // Attach decoded payload to request for downstream handlers
    req.user = decoded
    next()
  })
}
