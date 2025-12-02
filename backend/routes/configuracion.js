/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')
const express = require('express')
const router = express.Router()

// GET /api/v1/configuracion - Get all configurations
router.get('/', async (req, res) => {
    try {
        

        const [rows] = await db.query('SELECT * FROM configuracion ORDER BY fecha_creacion DESC')
        res.json({
            success: true,
            body: rows
        })
    } catch (error) {
        console.error('Error fetching configurations:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener las configuraciones'
        })
    }
})

// GET /api/v1/configuracion/:tipo - Get configurations by type
router.get('/:tipo', async (req, res) => {
    try {
        
        const { tipo } = req.params

        const [rows] = await db.query('SELECT * FROM configuracion WHERE tipo = ? ORDER BY fecha_creacion DESC', [tipo])
        res.json({
            success: true,
            body: rows
        })
    } catch (error) {
        console.error('Error fetching configurations by type:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener las configuraciones por tipo'
        })
    }
})

// POST /api/v1/configuracion - Create new configuration
router.post('/', async (req, res) => {
    try {
        
        const { tipo, texto, whatsapp } = req.body

        if (!tipo || !['phone', 'email', 'schedule'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo es requerido y debe ser phone, email o schedule'
            })
        }

        if (texto === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Texto es requerido'
            })
        }

        const [result] = await db.query(
            'INSERT INTO configuracion (tipo, texto, whatsapp) VALUES (?, ?, ?)',
            [tipo, texto, whatsapp || false]
        )

        const [newConfig] = await db.query('SELECT * FROM configuracion WHERE id = ?', [result.insertId])

        res.status(201).json({
            success: true,
            body: newConfig[0],
            message: 'Configuración creada exitosamente'
        })
    } catch (error) {
        console.error('Error creating configuration:', error)
        res.status(500).json({
            success: false,
            message: 'Error al crear la configuración'
        })
    }
})

// PUT /api/v1/configuracion/:id - Update configuration
router.put('/:id', async (req, res) => {
    try {
        
        const { id } = req.params
        const { tipo, texto, whatsapp } = req.body

        if (!tipo || !['phone', 'email', 'schedule'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo es requerido y debe ser phone, email o schedule'
            })
        }

        if (texto === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Texto es requerido'
            })
        }

        const [result] = await db.query(
            'UPDATE configuracion SET tipo = ?, texto = ?, whatsapp = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
            [tipo, texto, whatsapp || false, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Configuración no encontrada'
            })
        }

        const [updatedConfig] = await db.query('SELECT * FROM configuracion WHERE id = ?', [id])

        res.json({
            success: true,
            body: updatedConfig[0],
            message: 'Configuración actualizada exitosamente'
        })
    } catch (error) {
        console.error('Error updating configuration:', error)
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la configuración'
        })
    }
})

// DELETE /api/v1/configuracion/:id - Delete configuration
router.delete('/:id', async (req, res) => {
    try {
        
        const { id } = req.params

        const [result] = await db.query('DELETE FROM configuracion WHERE id = ?', [id])

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Configuración no encontrada'
            })
        }

        res.json({
            success: true,
            message: 'Configuración eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error deleting configuration:', error)
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la configuración'
        })
    }
})

module.exports = router
