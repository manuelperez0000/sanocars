import { useState } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'
import { useNavigate } from 'react-router-dom' 

export default function useLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    async function login() {
        setError(null)
        setLoading(true)
        try {
            const resp = await request.post(apiurl + '/auth/login', { email, password })
            if (!resp || !resp.data) throw new Error('Respuesta inválida del servidor')
            if (!resp.data.success) {
                throw new Error(resp.data.error || 'Credenciales inválidas')
            }

            // backend returns data: { user, token }
            const payload = resp.data.data || {}
            const user = payload.user || {}
            const token = payload.token || payload?.token

            if (!token) throw new Error('No se recibió token desde el servidor')

            // Save entire user + token to localStorage as requested
            try {
                var store = { token: token, user: user }
                localStorage.setItem('user', JSON.stringify(store))
            } catch (e) {
                console.warn('No se pudo guardar en localStorage', e)
            }

            setLoading(false)
            return { user, token }
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'Error en login')
            setLoading(false)
            throw err
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await login()
            navigate('/admin/dashboard')
        } catch (err) {
            void err
            // error state handled in hook
        }
    }

    function logout() {
        try {
            localStorage.removeItem('user')
        } catch (e) {
            console.warn('Error removing user from localStorage', e)
        }
        navigate('/')
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        login,
        handleSubmit,
        logout
    }
}
