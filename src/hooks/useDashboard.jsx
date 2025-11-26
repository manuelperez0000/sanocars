import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        vehiculosVendidosMes: 0,
        vehiculosAlquilados: 0,
        totalVehiculos: 0,
        financiamientosPendientes: 0,
        ingresos: {
            servicios: 0,
            ventas: 0,
            alquileres: 0
        }
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    async function fetchDashboardData() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/dashboard')
            if (resp?.data?.body) {
                setDashboardData(resp.data.body)
            }
        } catch (err) {
            console.error('fetchDashboardData error', err)
            setError(err?.response?.data?.message || 'Error cargando datos del dashboard')
        } finally {
            setLoading(false)
        }
    }

    return {
        dashboardData,
        loading,
        error,
        fetchDashboardData
    }
}

export default useDashboard
