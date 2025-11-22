import { createWithEqualityFn } from 'zustand/traditional'

const useConfigStore = createWithEqualityFn((set) => ({
    config: [],
    setConfig: (newState) => set(() => ({ config: newState })),
    emails: [],
    setEmails: (newState) => set(() => ({ emails: newState })),
    phones: [],
    setPhones: (newState) => set(() => ({ phones: newState })),
    schedules: [],
    setSchedules: (newState) => set(() => ({ schedules: newState })),
}))

export default useConfigStore