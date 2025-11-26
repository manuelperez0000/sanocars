import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // modal / edit states moved from page
    const [modalOpen, setModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        nationality: '',
        address: '',
        email: '',
        password: '',
        mobile_no: '',
        role: ''
    })

    const [loadingUser, setLoadingUser] = useState(false)
    const [saving, setSaving] = useState(false)

    const fetchUsers = async () => {
        try {
            const response = await request.get(apiurl + '/users')
            if (response.data.body) {
                setUsers(response.data.body)
            } else {
                setError('Error al obtener los usuarios')
            }
        } catch (err) {
            setError('Error de conexión con el servidor')
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const restoreUser = async (userId) => {
        try {
            const response = await request.put(apiurl + '/users/' + userId + '/restore')
            if (response.data) {
                // Refresh the users list after successful restore
                await fetchUsers()
                return response.data.body
            } else {
                throw new Error(response.data.message || 'Error al reestablecer usuario')
            }
        } catch (err) {
            console.error('Error restoring user:', err)
            throw err
        }
    }

    const deleteUser = async (userId) => {
        try {
            const response = await request.delete(apiurl + '/users/' + userId)
            if (response.data) {
                // Refresh the users list after successful delete
                await fetchUsers()
                return response.data.body
            } else {
                throw new Error(response.data.error || 'Error al eliminar usuario')
            }
        } catch (err) {
            console.error('Error deleting user:', err)
            throw err
        }
    }

    // Fetch a single user and open modal
    const openEditModal = async (user) => {
        setLoadingUser(true)
        setModalOpen(true)
        try {
            const resp = await request.get(apiurl + '/users/' + user.id)
            const fetched = resp?.data?.data || resp?.data || user
            setFormData({
                name: fetched.name || '',
                lastname: fetched.lastname || '',
                nationality: fetched.nationality || '',
                address: fetched.address || '',
                email: fetched.email || '',
                mobile_no: fetched.mobile_no || '',
                role: fetched.role || ''
            })
            setEditingUser(fetched)
        } catch (err) {
            // fallback to provided user object if request fails
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                nationality: user.nationality || '',
                address: user.address || '',
                email: user.email || '',
                mobile_no: user.mobile_no || '',
                role: user.role || ''
            })
            setEditingUser(user)
            console.error('Error fetching user detail:', err)
        } finally {
            setLoadingUser(false)
        }
    }

    const openNewModal = () => {
        setEditingUser(null)
        setFormData({ name: '', lastname: '', nationality: '', address: '', email: '', password: '', mobile_no: '', role: '' })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditingUser(null)
    }

    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!editingUser) return
        setSaving(true)
        try {
            const payload = {
                name: formData.name,
                lastname: formData.lastname,
                nationality: formData.nationality,
                address: formData.address,
                email: formData.email,
                mobile_no: formData.mobile_no,
                role: formData.role
            }
            await updateUser(editingUser.id, payload)
            closeModal()
        } catch (err) {
            console.error('Error actualizando usuario desde hook:', err)
            throw err
        } finally {
            setSaving(false)
        }
    }

    const handleCreate = async (userPayload) => {
        // create new user
        setSaving(true)
        try {
            const payload = userPayload || {
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                mobile_no: formData.mobile_no,
                nationality:formData.nationality,
                address:formData.address,
                role: formData.role,
                soft_delete: 1
            }
            const resp = await request.post(apiurl + '/users', payload)
            // refresh list
            await fetchUsers()
            if (!userPayload) {
                setModalOpen(false)
            }
            return resp
        } catch (err) {
            console.error('Error creando usuario desde hook:', err)
            const errorMessage = err.response?.data?.message || err.message || 'Error al crear usuario'
            throw new Error(errorMessage)
        } finally {
            setSaving(false)
        }
    }

    const updateUser = async (userId, payload) => {
        try {
            const response = await request.put(apiurl + '/users/' + userId, payload)
            if (response.data.success) {
                await fetchUsers()
                return response.data
            } else {
                throw new Error(response.data.error || 'Error al actualizar usuario')
            }
        } catch (err) {
            console.error('Error updating user:', err)
            throw err
        }
    }

    const handleRestoreUser = async (userId) => {
        if (window.confirm('¿Está seguro de que desea reestablecer este usuario?')) {
            try {
                await restoreUser(userId)
                // The hook should handle refreshing the users list
            } catch (error) {
                alert('Error al reestablecer el usuario: ' + error.message)
            }
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
            try {
                await deleteUser(userId)
                // The hook should handle refreshing the users list
            } catch (error) {
                alert('Error al eliminar el usuario: ' + error.message)
            }
        }
    }

    return {
        users,
        loading,
        error,
        restoreUser,
        deleteUser,
        updateUser,
        // modal/edit helpers
        modalOpen,
        openEditModal,
        openNewModal,
        closeModal,
        editingUser,
        formData,
        handleChange,
        handleSave,
        handleCreate,
        loadingUser,
        saving,
        handleRestoreUser,
        handleDeleteUser
    }
}

export default useUsers
