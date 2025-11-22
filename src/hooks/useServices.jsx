import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useServices = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)
    const [statusFilter, setStatusFilter] = useState('')

    const filteredServices = statusFilter === ''
        ? services
        : services.filter(service => service.status === parseInt(statusFilter))

    const handleStatusChange = async (serviceId, newStatus) => {
        try {
            await updateServiceStatus(serviceId, newStatus)
        } catch (error) {
            alert('Error al actualizar el estado: ' + error.message)
        }
    }

    const fetchServices = async () => {
        try {
            const response = await request.get(apiurl + '/reservas_servicio')
            if (response.data.body) {
                setServices(response.data.body)
            } else {
                setError('Error al obtener los servicios')
            }
        } catch (err) {
            setError('Error de conexión con el servidor')
            console.error('Error fetching services:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const updateServiceStatus = async (serviceId, status) => {
        setSaving(true)
        try {
            const response = await request.put(apiurl + '/reservas_servicio/' + serviceId, { status })
            if (response.data) {
                // Refresh the services list after successful update
                await fetchServices()
                return response.data
            } else {
                throw new Error(response.data.error || 'Error al actualizar el estado del servicio')
            }
        } catch (err) {
            console.error('Error updating service status:', err)
            throw err
        } finally {
            setSaving(false)
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 0: return 'Pendiente'
            case 1: return 'Aprobado'
            case 2: return 'Cancelado'
            case 3: return 'Ejecutado'
            default: return 'Desconocido'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'warning'
            case 1: return 'success'
            case 2: return 'danger'
            case 3: return 'info'
            default: return 'secondary'
        }
    }

    return {
        services,
        loading,
        error,
        saving,
        fetchServices,
        updateServiceStatus,
        getStatusText,
        getStatusColor,
        statusFilter,
        setStatusFilter,
        filteredServices,
        handleStatusChange
    }
}

export default useServices
