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

    return {
        clientes,
        loading,
        error,
        refetch: fetchClientes
    }
}

export default useClientes
