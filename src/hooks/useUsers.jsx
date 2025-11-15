import { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const useUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchUsers = async () => {
        try {
            const response = await request.get(apiurl + '/users')
            if (response.data.success) {
                setUsers(response.data.data)
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
            if (response.data.success) {
                // Refresh the users list after successful restore
                await fetchUsers()
                return response.data
            } else {
                throw new Error(response.data.error || 'Error al reestablecer usuario')
            }
        } catch (err) {
            console.error('Error restoring user:', err)
            throw err
        }
    }

    const deleteUser = async (userId) => {
        try {
            const response = await request.delete(apiurl + '/users/' + userId)
            if (response.data.success) {
                // Refresh the users list after successful delete
                await fetchUsers()
                return response.data
            } else {
                throw new Error(response.data.error || 'Error al eliminar usuario')
            }
        } catch (err) {
            console.error('Error deleting user:', err)
            throw err
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

    return {
        users,
        loading,
        error,
        restoreUser,
        deleteUser,
        updateUser
    }
}

export default useUsers
