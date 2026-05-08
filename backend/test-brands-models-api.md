# API Endpoints for Brands and Models Management

## Base URL
```
http://localhost:3001/api/v1/brands-models
```

## Endpoints

### Brands

#### GET /brands
Get all brands with their models
```bash
curl -X GET http://localhost:3001/api/v1/brands-models/brands
```

#### GET /brands/:id
Get a single brand with its models
```bash
curl -X GET http://localhost:3001/api/v1/brands-models/brands/1
```

#### POST /brands
Create a new brand
```bash
curl -X POST http://localhost:3001/api/v1/brands-models/brands \
  -H "Content-Type: application/json" \
  -d '{"name": "Nueva Marca"}'
```

#### PUT /brands/:id
Update a brand
```bash
curl -X PUT http://localhost:3001/api/v1/brands-models/brands/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Marca Actualizada"}'
```

#### DELETE /brands/:id
Delete a brand (and all its models)
```bash
curl -X DELETE http://localhost:3001/api/v1/brands-models/brands/1
```

### Models

#### GET /models/brand/:brandId
Get all models for a specific brand
```bash
curl -X GET http://localhost:3001/api/v1/brands-models/models/brand/1
```

#### POST /models
Create a new model
```bash
curl -X POST http://localhost:3001/api/v1/brands-models/models \
  -H "Content-Type: application/json" \
  -d '{"name": "Nuevo Modelo", "brand_id": 1}'
```

#### PUT /models/:id
Update a model
```bash
curl -X PUT http://localhost:3001/api/v1/brands-models/models/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Modelo Actualizado", "brand_id": 1}'
```

#### DELETE /models/:id
Delete a model
```bash
curl -X DELETE http://localhost:3001/api/v1/brands-models/models/1
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    // Datos del recurso
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Mensaje de error",
  "error": "Detalles del error (opcional)"
}
```

## Features

- **Validación**: Todos los campos requeridos son validados
- **Duplicados**: Evita crear marcas o modelos duplicados
- **Relaciones**: Las marcas y modelos están relacionados correctamente
- **Cascada**: Al eliminar una marca, se eliminan todos sus modelos
- **Ordenamiento**: Los resultados se ordenan alfabéticamente por nombre
