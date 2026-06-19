import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useClientes = () => {
    
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchClientes()
    }, [])

    const fetchClientes = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch data from single backend endpoint
            const response = await request.get(apiurl + '/clientes')

            if (response.data && response.data.success) {
                setClientes(response.data.data)
            } else {
                setClientes([])
            }
        } catch (err) {
            setError('Error al cargar los clientes: ' + (err?.response?.data?.message || err.message))
            setClientes([])
        } finally {
            setLoading(false)
        }
    }

    const deleteCliente = async (id) => {
        try {
            setLoading(true)
            setError(null)

            const response = await request.delete(apiurl + '/clientes/' + id)

            if (response.data && response.data.success) {
                // Remove from local state
                setClientes(prev => prev.filter(cliente => cliente.id !== id))
            } else {
                throw new Error(response.data?.message || 'Error al eliminar el cliente')
            }
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message || 'Error al eliminar el cliente')
        } finally {
            setLoading(false)
        }
    }

    return {
        clientes,
        loading,
        error,
        deleteCliente,
        refetch: fetchClientes
    }
}

export default useClientes
