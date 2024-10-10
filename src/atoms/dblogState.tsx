import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
const { persistAtom } = recoilPersist()

export const dblogState = atom({
    key: 'dblog' ,
    default: {
        penName: '',
        isRelated: false
    },
    effects_UNSTABLE: [persistAtom]
});