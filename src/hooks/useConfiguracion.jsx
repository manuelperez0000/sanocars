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
            setError(err?.response?.data?.message || 'Error cargando configuraciones')
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
            throw new Error(err?.response?.data?.message || 'Error creando configuración')
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
            throw new Error(err?.response?.data?.message || 'Error actualizando configuración')
        }
    }

    async function deleteConfiguracion(id) {
        try {
            await request.delete(apiurl + '/configuracion/' + id)
            fetchConfiguraciones() // Refresh the list
        } catch (err) {
            console.error('deleteConfiguracion error', err)
            throw new Error(err?.response?.data?.message || 'Error eliminando configuración')
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

    function getCompanyName() {
        return configuraciones.filter(config => config.tipo === 'company_name')
    }
 
    function getCompanyAddress() {
        return 'Fuji, Shizuoka, Japón'
    }

    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ texto: '', whatsapp: false });

    // --- Agregar nuevo item ---
    const agregarHorario = async () => {
        try {
            await createConfiguracion({ tipo: 'schedule', texto: '' });
        } catch (error) {
            alert('Error al agregar horario: ' + error.message);
        }
    };

    const agregarTelefono = async () => {
        try {
            await createConfiguracion({ tipo: 'phone', texto: '', whatsapp: false });
        } catch (error) {
            alert('Error al agregar teléfono: ' + error.message);
        }
    };

    const agregarCorreo = async () => {
        try {
            await createConfiguracion({ tipo: 'email', texto: '' });
        } catch (error) {
            alert('Error al agregar correo: ' + error.message);
        }
    };

    const agregarNombreEmpresa = async () => {
        try {
            await createConfiguracion({ tipo: 'company_name', texto: '' });
        } catch (error) {
            alert('Error al agregar nombre de empresa: ' + error.message);
        }
    };

    const agregarDireccionEmpresa = async () => {
        try {
            await createConfiguracion({ tipo: 'company_address', texto: '' });
        } catch (error) {
            alert('Error al agregar dirección de empresa: ' + error.message);
        }
    };

    // --- Editar item ---
    const startEditing = (item) => {
        setEditingItem(item);
        setEditForm({ texto: item.texto, whatsapp: item.whatsapp || false });
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setEditForm({ texto: '', whatsapp: false });
    };

    const saveEditing = async () => {
        try {
            await updateConfiguracion(editingItem.id, {
                tipo: editingItem.tipo,
                texto: editForm.texto,
                whatsapp: editForm.whatsapp
            });
            setEditingItem(null);
            setEditForm({ texto: '', whatsapp: false });
        } catch (error) {
            alert('Error al guardar cambios: ' + error.message);
        }
    };

    // --- Eliminar item ---
    const eliminarItem = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

        try {
            await deleteConfiguracion(id);
        } catch (error) {
            alert('Error al eliminar elemento: ' + error.message);
        }
    };

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
        getEmails,
        getCompanyName,
        getCompanyAddress,
        agregarHorario,
        agregarTelefono,
        agregarCorreo,
        agregarNombreEmpresa,
        agregarDireccionEmpresa,
        startEditing,
        cancelEditing,
        saveEditing,
        eliminarItem,
        editingItem,
        setEditingItem,
        editForm,
        setEditForm
    }
}

export default useConfiguracion
