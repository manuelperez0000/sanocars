import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useVisits = () => {
    const [visitCount, setVisitCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAndIncrementVisits()
    }, [])

    async function fetchAndIncrementVisits() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/visits')
            if (resp?.data?.body?.visits !== undefined) {
                setVisitCount(resp.data.body.visits)
            }
        } catch (err) {
            console.error('fetchAndIncrementVisits error', err)
            setError(err.message || 'Error cargando contador de visitas')
        } finally {
            setLoading(false)
        }
    }

    return {
        visitCount,
        loading,
        error,
        refetch: fetchAndIncrementVisits
    }
}

export default useVisits
