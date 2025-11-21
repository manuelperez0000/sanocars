import { apiurl } from "../utils/globals"
import request from "../utils/request"
import useConfigStore from "../zustand/useConfigStore"

const useApp = () => {

    const { setConfig } = useConfigStore()

    const getConfig = async () => {
        const res = await request.get(`${apiurl}/configuracion`)
        console.log('Config data:', res.data.body)
        setConfig(res.data.body)
    }

    const initApp = () => {
        getConfig()
    }

    return {
        initApp
    }
}

export default useApp