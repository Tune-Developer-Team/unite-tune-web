import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
const { persistAtom } = recoilPersist()

export const navigationState = atom({
    key: 'navigation' ,
    default: {
        isHidden: true,
        isEnableRedirect: true,
    },
    effects_UNSTABLE: [persistAtom]
});