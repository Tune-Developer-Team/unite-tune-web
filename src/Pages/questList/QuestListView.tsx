import React, { useEffect, useState } from "react";
import QuestTileList from "../../ui/quest/QuestTileList";
import {QuestListItem} from "../home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {QuestListViewModel} from "./QuestListViewModel";

const QuestListView: React.FC = () => {
    const navigate = useNavigate();
    const [authState] = useRecoilState(authenticationState);
    const [loading, setLoading] = useState(true);
    const [viewModel] = useState<QuestListViewModel>(new QuestListViewModel(authState));
    const [questList, setQuestList] = useState<QuestListItem[]>([])

    /**
     * questリストの読み込み
     */
    const loadQuestList = async (): Promise<void> => {
        console.log("===loadQuestList===");
        await viewModel.fetchQuestList().then((response)=>{

            console.log(response);
            setQuestList(viewModel.questList);
        }).catch((error)=>{
            console.log(error);
        });
    }

    useEffect(() => {
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
