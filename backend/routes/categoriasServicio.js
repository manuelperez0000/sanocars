/* eslint-disable no-undef */ 
var db = require('../db/dbConection.js')
const express = require('express')
const router = express.Router()

// GET /api/v1/categorias-servicio - Get all categories
router.get('/', async (req, res) => {
    try {
        
        
        const [rows] = await db.query('SELECT * FROM categorias_servicio ORDER BY fecha_creacion DESC')
        res.json({
            success: true,
            body: rows
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías'
        })
    }
})

// GET /api/v1/categorias-servicio/:id - Get category by ID
router.get('/:id', async (req, res) => {
    try {
        
        const { id } = req.params
        const [rows] = await db.query('SELECT * FROM categorias_servicio WHERE id = ?', [id])

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            })
        }

        res.json({
            success: true,
            body: rows[0]
        })
    } catch (error) {
        console.error('Error fetching category:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoría'
        })
    }
})

// POST /api/v1/categorias-servicio - Create new category
router.post('/', async (req, res) => {
    try {
        
        const { titulo, imagen } = req.body

        if (!titulo || !imagen) {
            return res.status(400).json({
                success: false,
                message: 'Título e imagen son requeridos'
            })
        }

        const [result] = await db.query(
            'INSERT INTO categorias_servicio (titulo, imagen) VALUES (?, ?)',
            [titulo, imagen]
        )

        const [newCategory] = await db.query('SELECT * FROM categorias_servicio WHERE id = ?', [result.insertId])

        res.status(201).json({
            success: true,
            body: newCategory[0],
            message: 'Categoría creada exitosamente'
        })
    } catch (error) {
        console.error('Error creating category:', error)
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoría'
        })
    }
})

// PUT /api/v1/categorias-servicio/:id - Update category
router.put('/:id', async (req, res) => {
    try {
        
        const { id } = req.params
        const { titulo, imagen } = req.body

        if (!titulo || !imagen) {
            return res.status(400).json({
                success: false,
                message: 'Título e imagen son requeridos'
            })
        }

        const [result] = await db.query(
            'UPDATE categorias_servicio SET titulo = ?, imagen = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
            [titulo, imagen, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            })
        }

        const [updatedCategory] = await db.query('SELECT * FROM categorias_servicio WHERE id = ?', [id])

        res.json({
            success: true,
            body: updatedCategory[0],
            message: 'Categoría actualizada exitosamente'
        })
    } catch (error) {
        console.error('Error updating category:', error)
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoría'
        })
    }
})

// DELETE /api/v1/categorias-servicio/:id - Delete category
router.delete('/:id', async (req, res) => {
    try {

        
        const { id } = req.params

        const [result] = await db.query('DELETE FROM categorias_servicio WHERE id = ?', [id])

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            })
        }

        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error deleting category:', error)
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la categoría'
        })
    }
})

// GET /api/v1/categorias-servicio/:categoriaId/items - Get items for a category
router.get('/:categoriaId/items', async (req, res) => {
    try {
        
        const { categoriaId } = req.params

        const [rows] = await db.query('SELECT * FROM item_servicio WHERE idCategoria = ? ORDER BY fecha_creacion DESC', [categoriaId])
        res.json({
            success: true,
            body: rows
        })
    } catch (error) {
        console.error('Error fetching items:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener los items'
        })
    }
})

// POST /api/v1/categorias-servicio/:categoriaId/items - Create new item
router.post('/:categoriaId/items', async (req, res) => {
    try {
        
        const { categoriaId } = req.params
        const { titulo } = req.body

        if (!titulo) {
            return res.status(400).json({
                success: false,
                message: 'Título es requerido'
            })
        }

        const [result] = await db.query(
            'INSERT INTO item_servicio (titulo, idCategoria) VALUES (?, ?)',
            [titulo, categoriaId]
        )

        const [newItem] = await db.query('SELECT * FROM item_servicio WHERE id = ?', [result.insertId])

        res.status(201).json({
            success: true,
            body: newItem[0],
            message: 'Item creado exitosamente'
        })
    } catch (error) {
        console.error('Error creating item:', error)
        res.status(500).json({
            success: false,
            message: 'Error al crear el item'
        })
    }
})

// DELETE /api/v1/categorias-servicio/items/:itemId - Delete item
router.delete('/items/:itemId', async (req, res) => {
    try {
        
        const { itemId } = req.params

        const [result] = await db.query('DELETE FROM item_servicio WHERE id = ?', [itemId])

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            })
        }

        res.json({
            success: true,
            message: 'Item eliminado exitosamente'
        })
    } catch (error) {
        console.error('Error deleting item:', error)
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el item'
        })
    }
})

module.exports = router
