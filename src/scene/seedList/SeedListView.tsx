import React, { useEffect, useState } from "react";
import SeedTileList from "../../ui/seed/SeedTileList";
import {SeedListItem} from "../home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {navigationState} from "../../atoms/NavigationState";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {SeedListViewModel} from "./SeedListViewModel";

const seedListViewModel = new SeedListViewModel();
const SeedListView: React.FC = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [viewModel] = useState<SeedListViewModel>(seedListViewModel);
    const [seedList, setSeedList] = useState<SeedListItem[]>([])

    /**
     * seedリストの読み込み
     */
    const loadSeedList = async (): Promise<void> => {
        console.log("===loadSeedList===");
        await viewModel.fetchSeedList(authState).then((response)=>{

            console.log(response);
            setSeedList(viewModel.seedList);
        }).catch((error)=>{
            console.log(error);
        });
    }

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
        // セットアップ
        viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }
        });

        void loadSeedList();

        setLoading(false);

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    useEffect(() => {
    }, []);

    if (loading) {
        return <div>Loading...</div>; // ローディング表示をここで行う
    }

    // 子コンポーネントに取得したフィードデータを渡す
    return <SeedTileList seedList={seedList} />;
};

export default SeedListView;
