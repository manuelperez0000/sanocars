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

    async function updateQuotaStatus({ vehicleId, cuotaIndex, status }) {
        //{ ventaIndex, cuotaIndex, status } 
        try {
            const resp = await request.put(apiurl + `/seguimiento/${vehicleId}/${cuotaIndex}/${status}`, { status })
            console.log("vehiculo: ", vehicleId)
            console.log("cuota: ", cuotaIndex)
            void resp
            return { success: true, message: "test" }
            /* if (resp?.data?.body) {
                // Refresh the data after updating
                await fetchSeguimiento()
                return { success: true, message: resp.data.body.message }
            } */
        } catch (err) {
            return { success: false, message: err?.response?.data?.message || 'Error actualizando estado de cuota' }
        }
    }

    return {
        vehicles,
        loading,
        error,
        fetchSeguimiento,
        updateQuotaStatus
    }
}

export default useSeguimiento
