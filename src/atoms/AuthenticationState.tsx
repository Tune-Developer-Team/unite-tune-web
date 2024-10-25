import { recoilPersist } from 'recoil-persist';
import { atom } from 'recoil';

const { persistAtom } = recoilPersist();

export interface AuthenticationStateIF {
    accessToken: string;
    uid: string;
    email: string;
}

export const authenticationState = atom<AuthenticationStateIF>({
    key: 'authentication',
    default: {
        accessToken: '',
        uid: '',
        email: ''
    },
    effects_UNSTABLE: [persistAtom]
});
