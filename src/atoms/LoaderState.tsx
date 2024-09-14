import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
const { persistAtom } = recoilPersist()

export const loaderState = atom({
    key: 'loader' ,
    default: {
        isLoading: ''
    },
    effects_UNSTABLE: [persistAtom]
});