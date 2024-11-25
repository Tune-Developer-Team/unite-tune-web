import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
import Profile from "../models/Profile/Profile";
const { persistAtom } = recoilPersist()

export const profileState = atom({
    key: 'profile',
    default: Profile.initProfile(),
    effects_UNSTABLE: [persistAtom]
});