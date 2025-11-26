import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useSeguimiento = () => {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchSeguimiento()
    }, [])

    async function fetchSeguimiento() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/seguimiento')
            if (resp?.data?.body) {
                setVehicles(resp.data.body)
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Error cargando datos de seguimiento')
        } finally {
            setLoading(false)
        }
    }

    return {
        vehicles,
        loading,
        error,
        fetchSeguimiento
    }
}

export default useSeguimiento
