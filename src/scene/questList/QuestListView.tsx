import React, { useEffect, useState } from "react";
import QuestTileList from "../../ui/quest/QuestTileList";
import {QuestListItem} from "../home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {navigationState} from "../../atoms/NavigationState";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {QuestListViewModel} from "./QuestListViewModel";

const questListViewModel = new QuestListViewModel();
const QuestListView: React.FC = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [viewModel] = useState<QuestListViewModel>(questListViewModel);
    const [questList, setQuestList] = useState<QuestListItem[]>([])

    /**
     * seedリストの読み込み
     */
    const loadQuestList = async (): Promise<void> => {
        console.log("===loadQuestList===");
        await viewModel.fetchQuestList(authState).then((response)=>{

            console.log(response);
            setQuestList(viewModel.questList);
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

        void loadQuestList();

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
    return <QuestTileList questList={questList} />;
};

export default QuestListView;
