/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const db = require('../db/dbConection')

// GET /api/v1/clientes - Get all clients from all tables
router.get('/', async (req, res) => {
    try {
        const queries = {
            ventas: 'SELECT * FROM venta',
            alquileres: 'SELECT * FROM alquileres',
            inspeccion_vehicular: 'SELECT * FROM inspeccion_vehicular',
            financiamiento: 'SELECT * FROM financing',
            servicios: 'SELECT * FROM servicios'
        }

        const results = {}

        // Execute all queries in parallel
        const promises = Object.entries(queries).map(async ([tableName, query]) => {
            try {
                const [rows] = await db.execute(query)
                results[tableName] = rows
            } catch (error) {
                console.error(`Error querying ${tableName}:`, error)
                results[tableName] = []
            }
        })

        await Promise.all(promises)

        // Normalize and combine data
        const normalizedClientes = []

        // Process ventas with vehicle data
        if (results.ventas) {
            // Get vehicle data for all ventas that have vehiculo_id
            const ventaVehiculoIds = results.ventas
                .filter(venta => venta.vehiculo_id)
                .map(venta => venta.vehiculo_id)

            let vehicleData = {}
            if (ventaVehiculoIds.length > 0) {
                try {
                    const placeholders = ventaVehiculoIds.map(() => '?').join(',')
                    const [vehicleRows] = await db.execute(
                        `SELECT id, marca, modelo, anio, color, numero_placa, imagen1, imagen2 FROM vehiculos_venta WHERE status != "eliminado" id IN (${placeholders})`,
                        ventaVehiculoIds
                    )
                    vehicleData = vehicleRows.reduce((acc, vehicle) => {
                        acc[vehicle.id] = vehicle
                        return acc
                    }, {})
                } catch (error) {
                    console.error('Error fetching vehicle data for ventas:', error)
                }
            }

            results.ventas.forEach(venta => {
                if (venta.cliente_nombre) {
                    const vehicle = venta.vehiculo_id ? vehicleData[venta.vehiculo_id] : null
                    normalizedClientes.push({
                        id: `venta_${venta.id}`,
                        nombre: venta.cliente_nombre,
                        apellido: venta.cliente_apellido || '',
                        email: venta.cliente_email || '',
                        telefono: venta.cliente_telefono || '',
                        vehiculo_marca: vehicle?.marca || '',
                        vehiculo_modelo: vehicle?.modelo || '',
                        vehiculo_anio: vehicle?.anio || '',
                        vehiculo_color: vehicle?.color || '',
                        vehiculo_placa: vehicle?.numero_placa || '',
                        vehiculo_imagenes: vehicle?.imagen1,
                        tabla_origen: 'venta'
                    })
                }
            })
        }

        // Process alquileres with vehicle data
        if (results.alquileres) {
            // Get vehicle data for all alquileres that have vehiculo_id
            const alquilerVehiculoIds = results.alquileres
                .filter(alquiler => alquiler.vehiculo_id)
                .map(alquiler => alquiler.vehiculo_id)

            let vehicleDataAlquiler = {}
            if (alquilerVehiculoIds.length > 0) {
                try {
                    const placeholders = alquilerVehiculoIds.map(() => '?').join(',')
                    const [vehicleRows] = await db.execute(
                        `SELECT id, marca, modelo, anio, color, numero_placa, imagen1, imagen2 FROM vehiculos_venta WHERE id IN (${placeholders})`,
                        alquilerVehiculoIds
                    )
                    vehicleDataAlquiler = vehicleRows.reduce((acc, vehicle) => {
                        acc[vehicle.id] = vehicle
                        return acc
                    }, {})
                } catch (error) {
                    console.error('Error fetching vehicle data for alquileres:', error)
                }
            }

            results.alquileres.forEach(alquiler => {
                if (alquiler.cliente_nombre) {
                    const vehicle = alquiler.vehiculo_id ? vehicleDataAlquiler[alquiler.vehiculo_id] : null
                    normalizedClientes.push({
                        id: `alquiler_${alquiler.id}`,
                        nombre: alquiler.cliente_nombre,
                        apellido: alquiler.cliente_apellido || '',
                        email: alquiler.cliente_email || '',
                        telefono: alquiler.cliente_telefono || '',
                        vehiculo_marca: vehicle?.marca || alquiler.vehiculo_marca || '',
                        vehiculo_modelo: vehicle?.modelo || alquiler.vehiculo_modelo || '',
                        vehiculo_anio: vehicle?.anio || alquiler.vehiculo_anio || '',
                        vehiculo_color: vehicle?.color || alquiler.vehiculo_color || '',
                        vehiculo_placa: vehicle?.numero_placa || alquiler.vehiculo_placa || '',
                        vehiculo_imagenes: vehicle?.imagen1,
                        tabla_origen: 'alquileres',
                    })
                }
            })
        }

        // Process inspeccion_vehicular
        if (results.inspeccion_vehicular) {
            results.inspeccion_vehicular.forEach(inspeccion => {
                if (inspeccion.cliente_nombre) {
                    normalizedClientes.push({
                        id: `inspeccion_${inspeccion.id}`,
                        nombre: inspeccion.cliente_nombre,
                        apellido: '', // No hay apellido en inspeccion
                        email: inspeccion.cliente_email || '',
                        telefono: inspeccion.cliente_telefono || '',
                        vehiculo_marca: inspeccion.vehiculo_marca || '',
                        vehiculo_modelo: inspeccion.vehiculo_modelo || '',
                        vehiculo_anio: inspeccion.vehiculo_anio || '',
                        vehiculo_color: inspeccion.vehiculo_color || '',
                        vehiculo_placa: inspeccion.vehiculo_placa || '',
                        tabla_origen: 'inspeccion_vehicular',
                        vehiculo_imagenes: `${inspeccion.foto_vehiculo},${inspeccion.foto_documento}`
                    })
                }
            })
        }

        // Process financiamiento
        if (results.financiamiento) {
            results.financiamiento.forEach(financiamiento => {
                if (financiamiento.cliente_nombre) {
                    normalizedClientes.push({
                        id: `financiamiento_${financiamiento.id}`,
                        nombre: financiamiento.cliente_nombre,
                        apellido: financiamiento.cliente_apellido || '',
                        email: financiamiento.cliente_email || '',
                        telefono: financiamiento.cliente_telefono || '',
                        vehiculo_marca: financiamiento.vehiculo_marca || '',
                        vehiculo_modelo: financiamiento.vehiculo_modelo || '',
                        vehiculo_anio: financiamiento.vehiculo_anio || '',
                        vehiculo_color: financiamiento.vehiculo_color || '',
                        vehiculo_placa: financiamiento.vehiculo_placa || '',
                        tabla_origen: 'financiamiento',
                        datos_completos: financiamiento,
                        vehiculo_imagenes: `${financiamiento.seiru_cado_frontal},${financiamiento.seiru_cado_trasero},${financiamiento.licencia_conducir_frontal},${financiamiento.licencia_conducir_trasero},${financiamiento.kokumin_shakai_hoken},${financiamiento.libreta_banco}`
                    })
                }
            })
        }




        // Process servicios
        if (results.servicios) {
            results.servicios.forEach(servicio => {
                if (servicio.cliente_nombre) {
                    normalizedClientes.push({
                        id: `servicio_${servicio.id}`,
                        nombre: servicio.cliente_nombre,
                        apellido: servicio.cliente_apellido || '',
                        email: servicio.cliente_email || '',
                        telefono: servicio.cliente_telefono || '',
                        vehiculo_marca: servicio.vehiculo_marca || '',
                        vehiculo_modelo: servicio.vehiculo_modelo || '',
                        vehiculo_anio: servicio.vehiculo_anio || '',
                        vehiculo_color: servicio.vehiculo_color || '',
                        vehiculo_placa: servicio.vehiculo_placa || '',
                        tabla_origen: 'servicios',
                        datos_completos: servicio
                    })
                }
            })
        }

        // Remove duplicates based on email and vehicle info
        const uniqueClientes = normalizedClientes.filter((cliente, index, self) =>
            index === self.findIndex(c =>
                c.email === cliente.email &&
                c.vehiculo_marca === cliente.vehiculo_marca &&
                c.vehiculo_modelo === cliente.vehiculo_modelo &&
                c.vehiculo_anio === cliente.vehiculo_anio
            )
        )

        res.json({
            success: true,
            data: uniqueClientes,
            total: uniqueClientes.length,
            message: 'Clientes obtenidos exitosamente'
        })

    } catch (error) {
        console.error('Error en /clientes:', error)
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        })
    }
})

module.exports = router
