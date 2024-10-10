import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
import ImagePath from "../models/data/ImagePath";
import {CuriosDirectionType} from "../consts/curiosDirection";
import Profile from "../models/Profile/Profile";
const { persistAtom } = recoilPersist()

export const profileState = atom({
    key: 'profile',
    default: {
        role: '',
        nick_name: '',
        icon_image: '',
        description: '',
        curios: '',
        curiosValue: '',
        curiosDirection: null,
        isPublishedAis: false,
        isShowMbti: false,
        isShowPortfolio: false,
        mbti: ''
    },
    effects_UNSTABLE: [persistAtom]
});