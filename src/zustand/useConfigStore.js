import { createWithEqualityFn } from 'zustand/traditional'

const useConfigStore = createWithEqualityFn((set) => ({
    config: [],
    setConfig: () => set((newState) => ({ config: newState })),
}))

export default useConfigStore