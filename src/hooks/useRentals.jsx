import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useRentals = () => {
    const [rentals, setRentals] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchRentals()
    }, [])

    async function fetchRentals() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/alquileres')
            if (resp?.data?.body) {
                setRentals(resp.data.body)
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Error cargando alquileres')
        } finally {
            setLoading(false)
        }
    }

    return {
        rentals,
        loading,
        error,
        fetchRentals
    }
}

export default useRentals
