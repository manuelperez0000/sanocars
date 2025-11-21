import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useItemsServicio = (categoriaId) => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (categoriaId) {
            fetchItems()
        }
    }, [categoriaId])

    async function fetchItems() {
        if (!categoriaId) return

        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/categorias-servicio/' + categoriaId + '/items')
            if (resp?.data?.body) {
                setItems(resp.data.body)
            }
        } catch (err) {
            console.error('fetchItems error', err)
            setError(err.message || 'Error cargando items de servicio')
        } finally {
            setLoading(false)
        }
    }

    async function createItem(itemData) {
        try {
            const resp = await request.post(apiurl + '/categorias-servicio/' + categoriaId + '/items', itemData)
            if (resp?.data?.body) {
                fetchItems() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('createItem error', err)
            throw new Error(err.message || 'Error creando item de servicio')
        }
    }

    async function deleteItem(itemId) {
        try {
            await request.delete(apiurl + '/categorias-servicio/items/' + itemId)
            fetchItems() // Refresh the list
        } catch (err) {
            console.error('deleteItem error', err)
            throw new Error(err.message || 'Error eliminando item de servicio')
        }
    }

    return {
        items,
        loading,
        error,
        fetchItems,
        createItem,
        deleteItem
    }
}

export default useItemsServicio
