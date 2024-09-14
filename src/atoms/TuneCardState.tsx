import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
const { persistAtom } = recoilPersist()

export const tuneCardState = atom({
    key: 'tuneCard' ,
    default: {
        serial: '',
        uid: ''
    },
    effects_UNSTABLE: [persistAtom]
});