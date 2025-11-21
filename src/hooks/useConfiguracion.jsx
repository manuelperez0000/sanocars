import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useConfiguracion = () => {
    const [configuraciones, setConfiguraciones] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchConfiguraciones()
    }, [])

    async function fetchConfiguraciones() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/configuracion')
            if (resp?.data?.body) {
                setConfiguraciones(resp.data.body)
            }
        } catch (err) {
            console.error('fetchConfiguraciones error', err)
            setError(err.message || 'Error cargando configuraciones')
        } finally {
            setLoading(false)
        }
    }

    async function createConfiguracion(configData) {
        try {
            const resp = await request.post(apiurl + '/configuracion', configData)
            if (resp?.data?.body) {
                fetchConfiguraciones() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('createConfiguracion error', err)
            throw new Error(err.message || 'Error creando configuración')
        }
    }

    async function updateConfiguracion(id, configData) {
        try {
            const resp = await request.put(apiurl + '/configuracion/' + id, configData)
            if (resp?.data?.body) {
                fetchConfiguraciones() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('updateConfiguracion error', err)
            throw new Error(err.message || 'Error actualizando configuración')
        }
    }

    async function deleteConfiguracion(id) {
        try {
            await request.delete(apiurl + '/configuracion/' + id)
            fetchConfiguraciones() // Refresh the list
        } catch (err) {
            console.error('deleteConfiguracion error', err)
            throw new Error(err.message || 'Error eliminando configuración')
        }
    }

    // Helper functions to get configurations by type
    function getSchedules() {
        return configuraciones.filter(config => config.tipo === 'schedule')
    }

    function getPhones() {
        return configuraciones.filter(config => config.tipo === 'phone')
    }

    function getEmails() {
        return configuraciones.filter(config => config.tipo === 'email')
    }

    return {
        configuraciones,
        loading,
        error,
        fetchConfiguraciones,
        createConfiguracion,
        updateConfiguracion,
        deleteConfiguracion,
        getSchedules,
        getPhones,
        getEmails
    }
}

export default useConfiguracion
