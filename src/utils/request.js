import axios from "axios"
const request = {
    post: async (url, body) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.post['Authorization'] = `Bearer ${localToken?.token || ''}`
        return await axios.post(url, body)
    },
    get: async (url) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.get['Authorization'] = `Bearer ${localToken?.token || ''}`
        return await axios.get(url)
    },
    put: async (url, body) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.put['Authorization'] = `Bearer ${localToken?.token || ''}`
        return await axios.put(url, body)
    },
    delete: async (url) => {
        const localToken = JSON.parse(localStorage.getItem('user'))
        axios.defaults.headers.delete['Authorization'] = `Bearer ${localToken?.token || ''}`
        return await axios.delete(url)
    }
}

export default request