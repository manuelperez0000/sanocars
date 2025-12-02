
import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useHome = () => {
    const [vehiclesForSale, setVehiclesForSale] = useState([])
    const [vehiclesForRent, setVehiclesForRent] = useState([])
    const [allVehicles,setAllVehicles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchVehicles()
    }, [])

    async function fetchVehicles() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/vehicles')
            if (resp?.data?.body) {
                const allVehicles = resp.data.body
                setAllVehicles(allVehicles)
                const sale = allVehicles.filter(v => v.status === 'En Venta')
                const rent = allVehicles.filter(v => v.status === 'En alquiler')
                setVehiclesForSale(sale)
                setVehiclesForRent(rent)
            }
        } catch (err) {
            console.error('fetchVehicles error', err)
            setError(err?.response?.data?.message || 'Error cargando vehículos')
        } finally {
            setLoading(false)
        }
    }

    return {
        vehiclesForSale,
        vehiclesForRent,
        loading,
        error,
        refetch: fetchVehicles,
        allVehicles
    }
}

export default useHome
