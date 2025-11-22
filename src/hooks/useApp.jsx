import { apiurl } from "../utils/globals"
import request from "../utils/request"
import useConfigStore from "../zustand/useConfigStore"

const useApp = () => {

    const { config, setConfig, emails, setEmails, phones, setPhones, schedules, setSchedules } = useConfigStore()

    const getConfig = async () => {
        const res = await request.get(`${apiurl}/configuracion`)
        const _config = res?.data?.body || []
        const emails = _config.length > 0 && _config.filter(item => item.tipo === 'email')
        const phones = _config.length > 0 && _config.filter(item => item.tipo === 'phone')
        const schedules = _config.length > 0 && _config.filter(item => item.tipo === 'schedule')
        setConfig(res?.data?.body || [])
        setEmails(emails)
        setPhones(phones)
        setSchedules(schedules)
    }

    const initApp = () => {
        getConfig()
    }

    return {
        initApp,
        config,
        emails, setEmails,
        phones, setPhones,
        schedules, setSchedules
    }
}

export default useApp