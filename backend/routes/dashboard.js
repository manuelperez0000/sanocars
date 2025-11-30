/* eslint-disable no-undef */
var connect = require('../db/connect.js')
var mysql = require('mysql2/promise')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/dashboard - Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const db = await mysql.createConnection(connect)
    if (!db) return responser.error({ res, message: 'Database not connected', status: 500 })

    // Get vehicles sold this month
    var currentDate = new Date()
    var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    var [vehiclesSoldResult] = await db.execute(
      'SELECT COUNT(*) as count FROM venta WHERE tipo = ? AND fecha_venta >= ?',
      ['vehiculo', firstDayOfMonth.toISOString().split('T')[0]]
    )
    var vehiclesSold = vehiclesSoldResult[0].count

    // Get vehicles currently rented
    var [vehiclesRentedResult] = await db.execute(
      'SELECT COUNT(*) as count FROM vehiculos_venta WHERE status = ?',
      ['En alquiler']
    )
    var vehiclesRented = vehiclesRentedResult[0].count

    // Get total vehicles in possession (all except deleted ones)
    var [totalVehiclesResult] = await db.execute(
      'SELECT COUNT(*) as count FROM vehiculos_venta WHERE status != ?',
      ['Eliminado']
    )
    var totalVehicles = totalVehiclesResult[0].count

    // Get pending financings
    var [pendingFinancingsResult] = await db.execute(
      'SELECT COUNT(*) as count FROM financiamiento WHERE status = ?',
      ['pendiente']
    )
    var pendingFinancings = pendingFinancingsResult[0].count

    // Get monthly income by category
    var [incomeResult] = await db.execute(`
      SELECT
        SUM(CASE WHEN tipo = 'servicio' THEN total ELSE 0 END) as servicios,
        SUM(CASE WHEN tipo = 'venta' THEN total ELSE 0 END) as ventas,
        SUM(CASE WHEN tipo = 'alquiler' THEN total ELSE 0 END) as alquileres
      FROM facturas
      WHERE MONTH(fecha_creacion) = MONTH(CURRENT_DATE())
      AND YEAR(fecha_creacion) = YEAR(CURRENT_DATE())
    `)

    var income = {
      servicios: incomeResult[0].servicios || 0,
      ventas: incomeResult[0].ventas || 0,
      alquileres: incomeResult[0].alquileres || 0
    }

    var dashboardData = {
      vehiculosVendidosMes: vehiclesSold,
      vehiculosAlquilados: vehiclesRented,
      totalVehiculos: totalVehicles,
      financiamientosPendientes: pendingFinancings,
      ingresos: income
    }

    return responser.success({ res, body: dashboardData })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return responser.error({ res, message: error?.message || 'Error interno del servidor', status: 500 })
  }
})

module.exports = router
