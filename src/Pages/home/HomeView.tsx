import React, {useEffect, useState} from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState, useSetRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {HomeViewModel} from "./HomeViewModel";
import {QuestListItem} from "./HomeViewModelIF";
import {navigationState} from "../../atoms/NavigationState";
import BlogPostTileBanner from "../library/Parts/dBlog/BlogPostTileBanner";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import QuestTileBanner from "../../ui/quest/QuestTileBanner";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import AllTabView from "./AllTabView/AllTabView";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {Fab, Switch, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import {endPoint} from "../../consts/api";
import ImagePath from "../../models/data/ImagePath";
import IconButton from "@mui/material/IconButton";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {QuestDetail} from "../../models/Quest/Quest";
import {SaveQuestParamIF} from "../quest/QuestViewModel";
import {FileUploadForm} from "../quest/FileUploadForm";
import CuriosTagInput from "../../ui/curiosTag/CuriosTagInput";
import {ParentItem, parentItemsState} from "../../atoms/ParentItemState";

const HomeView = () => {
    const navigate = useNavigate();

    // グローバル
    const setNavigation = useSetRecoilState(navigationState);
    const [authState] = useRecoilState(authenticationState);
    // const [profile, setProfile] = useRecoilState(profileState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);
    const [parentItems] = useRecoilState(parentItemsState);

    // UI
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewModel] = useState<HomeViewModel>(new HomeViewModel(authState));

    // QUEST作成
    const [questList, setQuestList] = useState<QuestListItem[]>([]);
    const [newQuestDetail, setNewQuestDetail] = useState<QuestDetail>(QuestDetail.initQuestDetail());
    const [newQuestId, setNewQuestId] = useState<string>(viewModel.generateQuestId());
    const [isShowDetailSetting, setIsShowDetailSetting] = useState<boolean>(false);
    const [imagePathList, setImagePathList] = useState<ImagePath[]>([]);
    const [newTags, setNewTags] = useState<string[]>([]);

    /**
     * questリストの読み込み
     */
    const loadQuestList = async (): Promise<void> => {
        console.log("===loadQuestList===");
        await viewModel.fetchQuestList().then((response)=>{
            console.log("---------------------成功------------------------")
            console.log(response)
            setQuestList(response.questList);
        }).catch((error)=>{
            console.log("---------------------失敗------------------------")
            console.log(error);
        });
    }

    // 内容を保存する
    // TODO: 変数名がよくないのでリファクタ
    const saveQuest = async (model: QuestDetail): Promise<void> => {
        const saveQuestParam: SaveQuestParamIF = {
            questId: newQuestId,
            ownerUserUid: authState.uid as string,
            isPublished: true,
            title: model.title,
            description: model.description,
            benefit: model.benefit,
            imagePathList: JSON.stringify(model.imagePathList),
            termsFrom: 0, // TODO: 仮
            termsTo: 0, // TODO: 仮
            curiosTagSentenceList: JSON.stringify(newTags),
            relationQuestIdList: JSON.stringify([]), // TODO: 未実装_関連するSeedを指定する機能
            mentionList: JSON.stringify([]) // TODO: 未実装_メンション_ユーザーにメンションできる機能
        };
        try {
            await viewModel.saveQuest(saveQuestParam);
        }
        catch(e) {
            throw e
        }
    }

    function findParentItemByLabel(parentItems: ParentItem[], label: string): ParentItem | undefined {
        return parentItems.find(item => item.label === label);
    }

    useEffect(() => {
        const parentPage = findParentItemByLabel(parentItems, "Home");
        if (parentPage != undefined){
            console.log("aaaaaaaaaaa");
        }

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

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    // ドロワー終了
    const toggleDrawer = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    // ファイル変更時に受け取るコールバック関数
    const handleFileChange = async (imagePath: ImagePath) => {
        // アップロード済みの画像パスをリストに追加
        setImagePathList((prevList: ImagePath[]) => [...prevList, imagePath]);
    };

    // 画像削除処理
    const handleImageDelete = async (index: number, imagePath: ImagePath) => {
        const api = viewModel.generateApi();
        try {
            const objectName = imagePath.getGCSObjectName();

            const params = {
                ObjectName: objectName,
                BucketName: "auth-tune"
            };
            await api.post({
                endPoint: `${endPoint.DELETE_IMAGE}`,
                body: params
            });
            console.log("Image deleted successfully");

            // 画像をリストから削除
            setImagePathList((prevList) => prevList.filter((_, i) => i !== index));
        } catch (error) {
            console.log("Failed to delete image", error);
        }
    };

    // 詳細な設定
    const toggleDetailSetting = () => {
        setIsShowDetailSetting(!isShowDetailSetting);
    }

    const [value, setValue] = React.useState(0);
    const [isActiveOwnerMode, setIsActiveOwnerMode] = React.useState(false);
    const questTabItemList = [{index: 0, label: '終了済み'}, {index: 1, label: '募集中'}];
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `seededit-tab-${index}`,
            'aria-controls': `seededit-tabpanel-${index}`,
        };
    }

    console.log(topTab.Home.selected.label);
    return (
        <div className="Home">
            {/* All */}
            <AllTabView viewModel={viewModel}/>
        </div>
    );
};

export default HomeView;
