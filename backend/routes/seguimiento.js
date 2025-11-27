/* eslint-disable no-undef */
var connect = require('../db/connect.js')
var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/seguimiento - Get vehicles with installment payments
router.get('/', async (req, res) => {
  try {
    var db = connect(req, res)

    // Query to get vehicles that have installment sales
    var query = `
    SELECT v.*, vv.*
    FROM venta v
    INNER JOIN vehiculos_venta vv 
        ON v.vehiculo_id = vv.id
    WHERE v.tipo_pago = 'cuotas' 
      AND v.numero_cuotas > 1
    ORDER BY v.id DESC`

    var [rows] = await db.execute(query)

    // Process the siguientes_pagos JSON for each vehicle
    var processedRows = rows.map(row => {
      let siguientes_pagos = []
      if (row.siguientes_pagos) {
        try {
          // siguientes_pagos is stored as JSON string
          siguientes_pagos = typeof row.siguientes_pagos === 'string'
            ? JSON.parse(row.siguientes_pagos)
            : row.siguientes_pagos
        } catch (error) {
          console.error('Error parsing siguientes_pagos for vehicle', row.id, error)
          siguientes_pagos = []
        }
      }

      return {
        ...row,
        siguientes_pagos: siguientes_pagos
      }
    })

    responser.success({ res, body: processedRows })
  } catch (error) {
    console.error('Error fetching seguimiento data:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  }
})

// PUT /api/v1/seguimiento/:vehicleId/cuota/:cuotaIndex - Update quota status
router.put('/:indexVenta/:indexCuota', async (req, res) => {

  const { indexVenta, indexCuota } = req.params
  console.log("indexventa: ", indexVenta)
  console.log("indexCuota: ", indexCuota)
  
  //need index venta index cuota 

  /*  var db = connect(req, res)
   const { cuotaIndex } = req.params
   //get siguientes_pagos from id cuotaindex
   const queryGet = `SELECT v.siguientes_pagos FROM venta v WHERE id = ${cuotaIndex}`
   var [rows] = await db.execute(queryGet)
 
   console.log(JSON.parse(rows[0].siguientes_pagos)) */

  responser.success({ res, body: { message: 'Estado de cuota actualizado correctamente' } })
  /* let siguientes_pagos = []
  if (rows.length > 0) {
    try {
      siguientes_pagos = typeof rows[0].siguientes_pagos === 'string'
        ? JSON.parse(rows[0].siguientes_pagos)
        : rows[0].siguientes_pagos
    } catch (error) {
      console.error('Error parsing siguientes_pagos for cuotaIndex', cuotaIndex, error)
      siguientes_pagos = []
    }
  } */

  /* try {
    var db = connect(req, res)
    const { status } = req.body

    // firss get cuota for index
    var queryCuota = `SELECT v.siguientes_pagos FROM venta v WHERE id = "cuotas"`
    var [rows] = await db.execute(queryCuota)

    // Update the specific quota status
    const cuotaIndexNum = parseInt(cuotaIndex)
    if (cuotaIndexNum >= 0 && cuotaIndexNum < siguientes_pagos.length) {
      siguientes_pagos[cuotaIndexNum].status = status
    } else {
      return responser.error({ res, message: 'Índice de cuota inválido' })
    }

    // Update the database with the modified JSON
    var updateQuery = `
    UPDATE venta
    SET siguientes_pagos = ?
    WHERE id = ?`

    await db.execute(updateQuery, [JSON.stringify(siguientes_pagos), vehicleId])

    responser.success({ res, body: { message: 'Estado de cuota actualizado correctamente' } })
  } catch (error) {
    console.error('Error updating quota status:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  } */
})

module.exports = router
