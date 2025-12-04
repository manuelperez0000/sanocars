import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useInformeVehiculos = () => {
    const [informes, setInformes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [loadCar, setLoadCar] = useState(false)

    useEffect(() => {
        fetchInformes()
        setTimeout(()=>{
            setLoadCar(true)
        },2500)
    }, [])

    async function fetchInformes() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/informe-vehiculos')
            if (resp?.data?.body) {
                setInformes(resp.data.body)
            }
        } catch (err) {
            console.error('fetchInformes error', err)
            setError(err?.response?.data?.message || 'Error cargando informes de vehículos')
        } finally {
            setLoading(false)
        }
    }

    async function createInforme(informeData) {
        try {
            const resp = await request.post(apiurl + '/informe-vehiculos', informeData)
            if (resp?.data?.body) {
                fetchInformes() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('createInforme error', err)
            throw new Error(err?.response?.data?.message || 'Error creando informe de vehículo')
        }
    }

    async function updateInforme(id, informeData) {
        try {
            const resp = await request.put(apiurl + '/informe-vehiculos/' + id, informeData)
            if (resp?.data?.body) {
                fetchInformes() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('updateInforme error', err)
            throw new Error(err?.response?.data?.message || 'Error actualizando informe de vehículo')
        }
    }

    async function deleteInforme(id) {
        try {
            await request.delete(apiurl + '/informe-vehiculos/' + id)
            fetchInformes() // Refresh the list
        } catch (err) {
            console.error('deleteInforme error', err)
            throw new Error(err?.response?.data?.message || 'Error eliminando informe de vehículo')
        }
    }

    async function getInforme(id) {
        try {
            const resp = await request.get(apiurl + '/informe-vehiculos/' + id)
            if (resp?.data?.body) {
                return resp.data.body
            }
        } catch (err) {
            console.error('getInforme error', err)
            throw new Error(err?.response?.data?.message || 'Error obteniendo informe de vehículo')
        }
    }

    return {
        informes,
        loading,
        error,
        fetchInformes,
        createInforme,
        updateInforme,
        deleteInforme,
        getInforme,
        loadCar
    }
}

export default useInformeVehiculos
