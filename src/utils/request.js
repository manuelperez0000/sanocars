import axios from "axios"
const request = {
    post: async (url, body, headers = {}) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.post['Authorization'] = `Bearer ${localToken?.token || ''}`

        // If body is FormData, don't set Content-Type (let axios set it automatically)
        if (!(body instanceof FormData)) {
            headers = { 'Content-Type': 'application/json', ...headers }
        }

        return await axios.post(url, body, { headers })
    },
    get: async (url) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.get['Authorization'] = `Bearer ${localToken?.token || ''}`
        return await axios.get(url)
    },
    put: async (url, body, headers = {}) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.put['Authorization'] = `Bearer ${localToken?.token || ''}`

        // If body is FormData, don't set Content-Type (let axios set it automatically)
        if (!(body instanceof FormData)) {
            headers = { 'Content-Type': 'application/json', ...headers }
        }

        return await axios.put(url, body, { headers })
    },
    delete: async (url) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.delete['Authorization'] = `Bearer ${localToken?.token || ''}`
        return await axios.delete(url)
    }
}

export default request
