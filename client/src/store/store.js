import create from 'zustand';

const useStore = create(set => ({
    secrets: [],
    setSecrets: (secs) => set(state => ({ secrets: secs }))
}));

export default useStore;