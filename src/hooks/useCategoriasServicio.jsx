import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useCategoriasServicio = () => {
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCategorias()
    }, [])

    async function fetchCategorias() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/categorias-servicio')
            if (resp?.data?.body) {
                setCategorias(resp.data.body)
            }
        } catch (err) {
            console.error('fetchCategorias error', err)
            setError(err.message || 'Error cargando categorías de servicio')
        } finally {
            setLoading(false)
        }
    }

    async function createCategoria(categoriaData) {
        try {
            const resp = await request.post(apiurl + '/categorias-servicio', categoriaData)
            if (resp?.data?.body) {
                fetchCategorias() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('createCategoria error', err)
            throw new Error(err.message || 'Error creando categoría de servicio')
        }
    }

    async function updateCategoria(id, categoriaData) {
        try {
            const resp = await request.put(apiurl + '/categorias-servicio/' + id, categoriaData)
            if (resp?.data?.body) {
                fetchCategorias() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('updateCategoria error', err)
            throw new Error(err.message || 'Error actualizando categoría de servicio')
        }
    }

    async function deleteCategoria(id) {
        try {
            await request.delete(apiurl + '/categorias-servicio/' + id)
            fetchCategorias() // Refresh the list
        } catch (err) {
            console.error('deleteCategoria error', err)
            throw new Error(err.message || 'Error eliminando categoría de servicio')
        }
    }

    async function getCategoria(id) {
        try {
            const resp = await request.get(apiurl + '/categorias-servicio/' + id)
            if (resp?.data?.body) {
                return resp.data.body
            }
        } catch (err) {
            console.error('getCategoria error', err)
            throw new Error(err.message || 'Error obteniendo categoría de servicio')
        }
    }

    return {
        categorias,
        loading,
        error,
        fetchCategorias,
        createCategoria,
        updateCategoria,
        deleteCategoria,
        getCategoria
    }
}

export default useCategoriasServicio
