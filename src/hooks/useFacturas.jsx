import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useFacturas = () => {
    const [facturas, setFacturas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchFacturas()
    }, [])

    async function fetchFacturas() {
        setLoading(true)
        setError(null)
        try {
            const resp = await request.get(apiurl + '/facturas')
            if (resp?.data?.body) {
                setFacturas(resp.data.body)
            }
        } catch (err) {
            console.error('fetchFacturas error', err)
            setError(err.message || 'Error cargando facturas')
        } finally {
            setLoading(false)
        }
    }

    async function createFactura(facturaData) {
        try {
            const resp = await request.post(apiurl + '/facturas', facturaData)
            if (resp?.data?.body) {
                fetchFacturas() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('createFactura error', err)
            throw new Error(err.message || 'Error creando factura')
        }
    }

    async function updateFactura(id, facturaData) {
        try {
            const resp = await request.put(apiurl + '/facturas/' + id, facturaData)
            if (resp?.data?.body) {
                fetchFacturas() // Refresh the list
                return resp.data.body
            }
        } catch (err) {
            console.error('updateFactura error', err)
            throw new Error(err.message || 'Error actualizando factura')
        }
    }

    async function deleteFactura(id) {
        try {
            await request.delete(apiurl + '/facturas/' + id)
            fetchFacturas() // Refresh the list
        } catch (err) {
            console.error('deleteFactura error', err)
            throw new Error(err.message || 'Error eliminando factura')
        }
    }

    async function getFactura(id) {
        try {
            const resp = await request.get(apiurl + '/facturas/' + id)
            if (resp?.data?.body) {
                return resp.data.body
            }
        } catch (err) {
            console.error('getFactura error', err)
            throw new Error(err.message || 'Error obteniendo factura')
        }
    }

    return {
        facturas,
        loading,
        error,
        fetchFacturas,
        createFactura,
        updateFactura,
        deleteFactura,
        getFactura
    }
}

export default useFacturas
