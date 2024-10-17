import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
const { persistAtom } = recoilPersist()

export const topTabState = atom({
    key: 'topTab' ,
    default: {
        label: ''
    },
    effects_UNSTABLE: [persistAtom]
});