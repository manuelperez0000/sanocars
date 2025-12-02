/* eslint-disable no-undef */
var db = require('../db/dbConection.js')

var express = require('express')
var router = express.Router()
var responser = require('../network/responser.js')

// GET /api/v1/seguimiento - Get vehicles with installment payments
router.get('/', async (req, res) => {
  try {


    // Query to get vehicles that have installment sales
    var query = `
    SELECT v.*, vv.*
    FROM venta v
    INNER JOIN vehiculos_venta vv 
        ON v.vehiculo_id = vv.id
    WHERE v.tipo_pago = 'cuotas' 
      AND v.numero_cuotas > 1
    ORDER BY v.id DESC`

    var [rows] = await db.query(query)

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
router.put('/:vehicleId/:cuotaIndex', async (req, res) => {

  try {
    const { status } = req.body
    const { vehicleId, cuotaIndex } = req.params
    console.log(vehicleId, " ", cuotaIndex, " ", status)

    const queryPagos = `SELECT v.siguientes_pagos FROM venta v WHERE vehiculo_id = ${vehicleId}`
    var [result] = await db.query(queryPagos)


    const pagos = JSON.parse(result[0].siguientes_pagos)
    const cuota = pagos.find(p => Number(p.numero_cuota) === Number(cuotaIndex))

    cuota.status = status
    /*  console.log(cuota) */
    //modifico la cuota
    pagos[cuotaIndex - 1] = cuota
    const queryVentas = `UPDATE venta SET siguientes_pagos = ? WHERE vehiculo_id = ?`;
    /* const resultUpdate =  */await db.query(queryVentas, [JSON.stringify(pagos), vehicleId])
    /* console.log(resultUpdate) */
    responser.success({ res, body: { message: 'Estado de cuota actualizado correctamente' } })

  } catch (error) {
    responser.error({ res, message: error.message || "No se ha podido actualizar la cuota" })
  }

  /* console.log("indexventa: ", vehicleId)
  console.log("indexCuota: ", cuotaIndex) */
  /*  
   const { cuotaIndex } = req.params
   //get siguientes_pagos from id cuotaindex
   const queryGet = `SELECT v.siguientes_pagos FROM venta v WHERE id = ${cuotaIndex}`
   var [rows] = await db.query(queryGet)
 
   console.log(JSON.parse(rows[0].siguientes_pagos)) */

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
    
    const { status } = req.body

    // firss get cuota for index
    var queryCuota = `SELECT v.siguientes_pagos FROM venta v WHERE id = "cuotas"`
    var [rows] = await db.query(queryCuota)

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

    await db.query(updateQuery, [JSON.stringify(siguientes_pagos), vehicleId])

    responser.success({ res, body: { message: 'Estado de cuota actualizado correctamente' } })
  } catch (error) {
    console.error('Error updating quota status:', error)
    responser.error({ res, message: error?.message || 'Error interno del servidor' })
  } */
})

module.exports = router
