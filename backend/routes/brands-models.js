/* eslint-disable no-undef */
var express = require("express")
var route = express.Router()
var db = require('../db/dbConection.js')

// GET all brands with their models (for SearchBar compatibility)
route.get('/brands', async (req, res) => {
  try {
    const conn = db
    
    // Get all brands
    const [brands] = await conn.query(`
      SELECT 
        b.id,
        b.name as brand_name,
        b.created_at,
        b.updated_at
      FROM carBrands b
      ORDER BY b.name ASC
    `)
    
    // Get all models
    const [models] = await conn.query(`
      SELECT 
        m.id,
        m.name,
        m.brand_id,
        m.created_at,
        m.updated_at
      FROM carModels m
      ORDER BY m.name ASC
    `)
    
    // Combine brands with their models
    const brandsWithModels = brands.map(brand => {
      const brandModels = models.filter(model => model.brand_id === brand.id)
      return {
        ...brand,
        models: brandModels
      }
    })
    
    res.json({
      success: true,
      data: brandsWithModels
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener las marcas',
      error: error.message
    })
  }
})

// GET vehicles in objVehicles.json format (for SearchBar compatibility)
route.get('/vehicles', async (req, res) => {
  try {
    const conn = db
    
    // Get all brands
    const [brands] = await conn.query(`
      SELECT 
        b.id,
        b.name as brand_name,
        b.created_at,
        b.updated_at
      FROM carBrands b
      ORDER BY b.name ASC
    `)
    
    // Get all models
    const [models] = await conn.query(`
      SELECT 
        m.id,
        m.name,
        m.brand_id,
        m.created_at,
        m.updated_at
      FROM carModels m
      ORDER BY m.name ASC
    `)
    
    // Transform to objVehicles.json format
    const vehicles = brands.map(brand => {
      const brandModels = models
        .filter(model => model.brand_id === brand.id)
        .map(model => model.name) // Extract just the name as string
      
      return {
        name: brand.brand_name,
        models: brandModels
      }
    })
    
    res.json({
      success: true,
      data: {
        vehicles: vehicles
      }
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener los vehículos',
      error: error.message
    })
  }
})

// GET a single brand with its models
route.get('/brands/:id', async (req, res) => {
  try {
    const conn = db
    const brandId = req.params.id
    
    // Get brand
    const [brands] = await conn.query(`
      SELECT 
        b.id,
        b.name as brand_name,
        b.created_at,
        b.updated_at
      FROM carBrands b
      WHERE b.id = ?
    `, [brandId])
    
    if (brands.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      })
    }
    
    // Get models for this brand
    const [models] = await conn.query(`
      SELECT 
        m.id,
        m.name,
        m.brand_id,
        m.created_at,
        m.updated_at
      FROM carModels m
      WHERE m.brand_id = ?
      ORDER BY m.name ASC
    `, [brandId])
    
    // Combine brand with its models
    const brandWithModels = {
      ...brands[0],
      models: models
    }
    
    res.json({
      success: true,
      data: brandWithModels
    })
  } catch (error) {
    console.error('Error fetching brand:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener la marca',
      error: error.message
    })
  }
})

// POST create a new brand
route.post('/brands', async (req, res) => {
  try {
    const conn = db
    const { name } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la marca es requerido'
      })
    }
    
    // Check if brand already exists
    const [existing] = await conn.query('SELECT id FROM carBrands WHERE name = ?', [name.trim()])
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Esta marca ya existe'
      })
    }
    
    const [result] = await conn.query('INSERT INTO carBrands (name) VALUES (?)', [name.trim()])
    
    res.status(201).json({
      success: true,
      message: 'Marca creada exitosamente',
      data: {
        id: result.insertId,
        name: name.trim()
      }
    })
  } catch (error) {
    console.error('Error creating brand:', error)
    res.status(500).json({
      success: false,
      message: 'Error al crear la marca',
      error: error.message
    })
  }
})

// PUT update a brand
route.put('/brands/:id', async (req, res) => {
  try {
    const conn = db
    const brandId = req.params.id
    const { name } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la marca es requerido'
      })
    }
    
    // Check if brand exists
    const [existing] = await conn.query('SELECT id FROM carBrands WHERE id = ?', [brandId])
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      })
    }
    
    // Check if name already exists for another brand
    const [duplicate] = await conn.query('SELECT id FROM carBrands WHERE name = ? AND id != ?', [name.trim(), brandId])
    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Esta marca ya existe'
      })
    }
    
    await conn.query('UPDATE carBrands SET name = ? WHERE id = ?', [name.trim(), brandId])
    
    res.json({
      success: true,
      message: 'Marca actualizada exitosamente',
      data: {
        id: parseInt(brandId),
        name: name.trim()
      }
    })
  } catch (error) {
    console.error('Error updating brand:', error)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la marca',
      error: error.message
    })
  }
})

// DELETE a brand (and all its models)
route.delete('/brands/:id', async (req, res) => {
  try {
    const conn = db
    const brandId = req.params.id
    
    // Check if brand exists
    const [existing] = await conn.query('SELECT id FROM carBrands WHERE id = ?', [brandId])
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      })
    }
    
    // Delete brand (models will be deleted due to CASCADE)
    await conn.query('DELETE FROM carBrands WHERE id = ?', [brandId])
    
    res.json({
      success: true,
      message: 'Marca eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting brand:', error)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la marca',
      error: error.message
    })
  }
})

// GET all models for a specific brand
route.get('/models/brand/:brandId', async (req, res) => {
  try {
    const conn = db
    const brandId = req.params.brandId
    
    const [models] = await conn.query(`
      SELECT 
        m.id,
        m.name,
        m.brand_id,
        m.created_at,
        m.updated_at,
        b.name as brand_name
      FROM carModels m
      JOIN carBrands b ON m.brand_id = b.id
      WHERE m.brand_id = ?
      ORDER BY m.name ASC
    `, [brandId])
    
    res.json({
      success: true,
      data: models
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener los modelos',
      error: error.message
    })
  }
})

// POST create a new model
route.post('/models', async (req, res) => {
  try {
    const conn = db
    const { name, brand_id } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del modelo es requerido'
      })
    }
    
    if (!brand_id) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la marca es requerido'
      })
    }
    
    // Check if brand exists
    const [brandExists] = await conn.query('SELECT id FROM carBrands WHERE id = ?', [brand_id])
    if (brandExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La marca especificada no existe'
      })
    }
    
    // Check if model already exists for this brand
    const [existing] = await conn.query(
      'SELECT id FROM carModels WHERE name = ? AND brand_id = ?', 
      [name.trim(), brand_id]
    )
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Este modelo ya existe para esta marca'
      })
    }
    
    const [result] = await conn.query(
      'INSERT INTO carModels (name, brand_id) VALUES (?, ?)', 
      [name.trim(), brand_id]
    )
    
    res.status(201).json({
      success: true,
      message: 'Modelo creado exitosamente',
      data: {
        id: result.insertId,
        name: name.trim(),
        brand_id: parseInt(brand_id)
      }
    })
  } catch (error) {
    console.error('Error creating model:', error)
    res.status(500).json({
      success: false,
      message: 'Error al crear el modelo',
      error: error.message
    })
  }
})

// PUT update a model
route.put('/models/:id', async (req, res) => {
  try {
    const conn = db
    const modelId = req.params.id
    const { name, brand_id } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del modelo es requerido'
      })
    }
    
    if (!brand_id) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la marca es requerido'
      })
    }
    
    // Check if model exists
    const [existing] = await conn.query('SELECT id FROM carModels WHERE id = ?', [modelId])
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Modelo no encontrado'
      })
    }
    
    // Check if brand exists
    const [brandExists] = await conn.query('SELECT id FROM carBrands WHERE id = ?', [brand_id])
    if (brandExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La marca especificada no existe'
      })
    }
    
    // Check if name already exists for another model in the same brand
    const [duplicate] = await conn.query(
      'SELECT id FROM carModels WHERE name = ? AND brand_id = ? AND id != ?', 
      [name.trim(), brand_id, modelId]
    )
    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Este modelo ya existe para esta marca'
      })
    }
    
    await conn.query(
      'UPDATE carModels SET name = ?, brand_id = ? WHERE id = ?', 
      [name.trim(), brand_id, modelId]
    )
    
    res.json({
      success: true,
      message: 'Modelo actualizado exitosamente',
      data: {
        id: parseInt(modelId),
        name: name.trim(),
        brand_id: parseInt(brand_id)
      }
    })
  } catch (error) {
    console.error('Error updating model:', error)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el modelo',
      error: error.message
    })
  }
})

// DELETE a model
route.delete('/models/:id', async (req, res) => {
  try {
    const conn = db
    const modelId = req.params.id
    
    // Check if model exists
    const [existing] = await conn.query('SELECT id FROM carModels WHERE id = ?', [modelId])
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Modelo no encontrado'
      })
    }
    
    await conn.query('DELETE FROM carModels WHERE id = ?', [modelId])
    
    res.json({
      success: true,
      message: 'Modelo eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting model:', error)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el modelo',
      error: error.message
    })
  }
})

module.exports = route
