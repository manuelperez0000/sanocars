import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useVentas = () => {
    const [ventas, setVentas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchVentas()
    }, [])

    const fetchVentas = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await request.get(apiurl + '/venta')

            if (response.data.body) {
                setVentas(response.data.body)
            } else {
                setVentas([])
            }
        } catch (err) {
            setError('Error al cargar las ventas: ' + (err?.response?.data?.message || err.message))
            setVentas([])
        } finally {
            setLoading(false)
        }
    }

    const deleteVenta = async (id) => {
        try {
            await request.delete(apiurl + '/venta/' + id)
            // Remove from local state
            setVentas(prev => prev.filter(venta => venta.id !== id))
            return { success: true }
        } catch (err) {
            return { success: false, error: err?.response?.data?.message || err.message }
        }
    }

    return {
        ventas,
        loading,
        error,
        refetch: fetchVentas,
        deleteVenta
    }
}

export default useVentas
