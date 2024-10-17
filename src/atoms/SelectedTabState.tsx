import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
const { persistAtom } = recoilPersist()

export const selectedTabState = atom<SelectedTabIF>({
    key: 'selectedTab',
    default: {
        Home: {
            selected: {
                label: 'All',
            }
        },
        ThinkTank: {
            selected: {
                label: '',
            }
        },
        AIS: {
            selected: {
                label: '',
            }
        },
        Profile: {
            selected: {
                label: '',
            }
        }
    },
    effects_UNSTABLE: [persistAtom]
});

export interface SelectedTabIF {
    Home: {
        selected:{
            label: string,
        }
    },
    ThinkTank: {
        selected:{
            label: string,
        }
    },
    AIS: {
        selected:{
            label: string,
        }
    },
    Profile: {
        selected:{
            label: string,
        }
    }
}