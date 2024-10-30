import React, {useEffect, useState} from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {HomeViewModel} from "./HomeViewModel";
import {QuestListItem} from "./HomeViewModelIF";
import {navigationState} from "../../atoms/NavigationState";
import BlogPostTileBanner from "../../ui/blogPost/BlogPostTileBanner";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import QuestTileBanner from "../../ui/quest/QuestTileBanner";
import CustomTabs, {TabItem} from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import BlogPostTileSixColumn from "../../ui/blogPostSixColumn/BlogPostTileSixColumn";
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
import RoundedButton from "../../ui/button/RoundedButton";
import {QuestDetail} from "../../models/Quest/Quest";
import {Api} from "../../models/Api/Api";
import {SaveQuestParamIF} from "../Quest/QuestViewModel";
import {FileUploadForm} from "../Quest/FileUploadForm";
import CuriosTagInput from "../../ui/curiosTag/CuriosTagInput";

const HomeView = () => {
    const navigate = useNavigate();

    // グローバル
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

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

    const tabItems: TabItem[] = [
        {label: 'All'},
        {label: 'Quest'},
        {label: 'Blog'},
        {label: 'Goods'}
    ];

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
            <CustomTabs tabItems={tabItems} bottomTab={'Home'}/>
            {/* All */}
            <Box sx={{display: topTab.Home.selected.label === 'All' ? "block" : "none"}}>
            <AllTabView viewModel={viewModel}/>
            </Box>
            {/* Blog */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Blog' ? "block" : "none"}} spacing={2} className={"Blog"}>
                <Grid container spacing={2} className={"new-arrival-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            ✨ NEW ARRIVAL
                        </Typography>
                        <Box textAlign={"end"} paddingRight={1}>
                            <Button variant="text" style={{color:"#fff"}} onClick={() => {
                                navigate(`/blogposts`)
                            }}>全て表示する</Button>
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={12} md={12} lg={12} >
                        <BlogPostTileBanner/>
                    </Grid>
                </Grid>
            </Grid>

            {/* Quest */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Quest' ? "block" : "none"}} spacing={2}
                  className={"Quest"}>
                <Box width={"100%"} display={"flex"} paddingRight={4}>
                    <Box width={"100%"} textAlign={"center"}>
                        <Typography>{isActiveOwnerMode ? "OwnerMode" : "WorkerMode"}</Typography>
                    </Box>
                    <Box textAlign={"end"}>
                        <Switch
                            checked={isActiveOwnerMode}
                            onChange={(event, checked) => {
                                setIsActiveOwnerMode(!isActiveOwnerMode);
                            }}
                            name="IsPublishedAis"
                            color="primary"
                        />
                    </Box>
                </Box>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {questTabItemList.map((item) => (
                        <Tab sx={{width: '50%'}} key={item.index}
                             label={item.label} {...a11yProps(item.index)} />
                    ))}
                </Tabs>
                <Grid container spacing={3} className={"quest-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            {/*このシードがアツい！*/}
                            ⚡️ QUESTS
                        </Typography>
                        <Box textAlign={"end"} paddingRight={1}>
                            {/*<Button variant="text" style={{color:"#fff"}} onClick={() => {*/}
                            {/*    navigate(`/quests`)*/}
                            {/*}}>全て表示する</Button>*/}
                        </Box>
                        <Grid xs={12} sm={12} md={12} lg={12} >
                            <QuestTileBanner questList={questList.filter((questItem) => {
                                if (isActiveOwnerMode) {
                                    // TODO: 実装
                                    return questItem.ownerUserUid === authState.uid
                                } else {
                                    // TODO: 実装
                                    return questItem.ownerUserUid !== authState.email
                                }
                            })}/>
                        </Grid>
                        <Box sx={{position: "relative", display: isActiveOwnerMode ? "block" : "none"}}>
                            <Fab sx={{position: "fixed", bottom: 100, right: 40}} color="primary" aria-label="add"
                                 onClick={() => {
                                     setIsDrawerOpen(true);
                                     setNewQuestId(viewModel.generateQuestId());
                                 }}>
                                <AddIcon/>
                            </Fab>
                        </Box>
                        {/*EditDrawer*/}
                        <Drawer
                            anchor="bottom"
                            open={isDrawerOpen}
                            onClose={() => toggleDrawer(false)}
                            sx={{'& .MuiDrawer-paper': {padding: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20}}}
                        >
                            <Box display={"flex"} paddingBottom={4}>
                                <Typography width={"100%"} textAlign={"start"} color={"#f6f6f6"} onClick={async () => {
                                    toggleDrawer(false);
                                }
                                } sx={{font: 'bold'}}>
                                    キャンセル
                                </Typography>
                                <Typography width={"100%"} textAlign={"end"} color={"#325eff"} onClick={async () => {

                                    // 画像の更新
                                    if (imagePathList.length > 0) {
                                        Object.assign(newQuestDetail.imagePathList, imagePathList)
                                    }

                                    // モデルインスタンスの更新
                                    setNewQuestDetail(newQuestDetail);

                                    console.log('=======画像========');
                                    console.log(newQuestDetail);
                                    console.log('=======画像========');

                                    // DBへ保存
                                    await saveQuest(newQuestDetail);

                                    // ドロワーを閉じる
                                    toggleDrawer(false);
                                }
                                } sx={{font: 'bold'}}>
                                    完了
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                {/*依頼件名*/}
                                <Grid xs={12} sm={12} md={12} lg={12}>
                                    <Typography textAlign={"center"} variant={"h6"}> 依頼件名 </Typography>
                                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                                        <TextField
                                            fullWidth
                                            required
                                            multiline
                                            rows={2}
                                            variant="standard"
                                            hiddenLabel
                                            defaultValue={newQuestDetail.title}
                                            onChange={(event) => {
                                                newQuestDetail.title = event.target.value;
                                                setNewQuestDetail(newQuestDetail);
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                {/*詳細*/}
                                <Grid xs={12} sm={12} md={12} lg={12}>
                                    <Typography textAlign={"center"} variant={"h6"}> 詳細 </Typography>
                                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                                        <TextField
                                            fullWidth
                                            required
                                            multiline
                                            rows={6}
                                            variant="standard"
                                            hiddenLabel
                                            defaultValue={newQuestDetail.description}
                                            onChange={(event) => {
                                                newQuestDetail.description = event.target.value;
                                                setNewQuestDetail(newQuestDetail);
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                {/*報酬*/}
                                <Grid xs={12} sm={12} md={12} lg={12}>
                                    <Typography textAlign={"center"} variant={"h6"}> 報酬 </Typography>
                                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                                        <TextField
                                            fullWidth
                                            required
                                            multiline
                                            rows={2}
                                            variant="standard"
                                            hiddenLabel
                                            defaultValue={newQuestDetail.benefit}
                                            onChange={(event) => {
                                                newQuestDetail.benefit = event.target.value;
                                                setNewQuestDetail(newQuestDetail);
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                {/*CuriosTag*/}
                                <Grid xs={12} sm={12} md={12} lg={12} paddingBottom={4}>
                                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.2rem"}}>
                                        <CuriosTagInput tags={newTags} setTags={setNewTags}/>
                                    </Box>
                                </Grid>

                                {/*画像*/}
                                <Grid xs={12} sm={12} md={12} lg={12}>
                                    <FileUploadForm onFileChange={handleFileChange}
                                                     folderName={newQuestId}
                                                     uploadEndPoint={endPoint.UPLOAD_SEED_IMAGE}/>
                                    <Box>
                                        {imagePathList.map((imagePath: ImagePath, index: number) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: "relative",
                                                    width: 100,
                                                    height: 100,
                                                }}
                                            >
                                                <img
                                                    src={imagePath.path}
                                                    alt={imagePath.alt}
                                                    width="100"
                                                    height="100"
                                                    style={{objectFit: "cover"}}
                                                />
                                                {/* ホバーで表示される削除ボタン */}
                                                <IconButton
                                                    onClick={() => handleImageDelete(index, imagePath)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 0,
                                                        color: "white",
                                                        bgcolor: "rgba(255,255,255,0.5)",
                                                        '&:hover': {
                                                            bgcolor: "rgba(255, 0, 0, 0.7)"
                                                        },
                                                    }}
                                                >
                                                    <span color={"#ff3737"}>削除</span>
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>

                                {/*詳細な設定 切り替えボタン*/}
                                <Grid xs={12} sm={12} md={12} lg={12} paddingBottom={4}>
                                    <Typography textAlign={"center"} color={"#43bbff"} onClick={() => {
                                        toggleDetailSetting()
                                    }}> 詳細な設定 </Typography>
                                </Grid>
                            </Grid>

                            {/*詳細な設定*/}
                            <Grid display={isShowDetailSetting ? "block" : "none"}>
                                <Grid xs={12} sm={12} md={12} lg={12}>
                                    <Typography textAlign={"center"} variant={"h6"}> 興味タグ </Typography>
                                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                                        <TextField
                                            fullWidth
                                            required
                                            multiline
                                            rows={2}
                                            variant="standard"
                                            hiddenLabel
                                            defaultValue={JSON.stringify(newQuestDetail.hashTagStringList)}
                                            onChange={(event) => {
                                                const rawString = JSON.parse(event.target.value);
                                                console.log(rawString);
                                                newQuestDetail.hashTagStringList = ['#a', '#b'];
                                                setNewQuestDetail(newQuestDetail);
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid xs={12} sm={12} md={12} lg={12}>
                                    <Typography textAlign={"center"} variant={"h6"}> 期間 </Typography>
                                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem", display: "flex"}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                defaultValue={newQuestDetail.getTermsFromAsDysJS() || dayjs()}
                                                onChange={
                                                    (date) => {
                                                        newQuestDetail.termsFrom = date.toString();
                                                    }
                                                }
                                            />
                                            <Box width={70} paddingTop={2} textAlign={"center"}>から</Box>
                                            <DatePicker
                                                defaultValue={newQuestDetail.getTermsToAsDysJS() || dayjs()}
                                                onChange={
                                                    (date) => {
                                                        newQuestDetail.termsTo = date.toString();
                                                    }
                                                }
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Drawer>
                    </Grid>
                </Grid>
            </Grid>

            {/* Goods */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Goods' ? "block" : "none"}} spacing={2} className={"Goods"}>
                新着の本とかおもちゃとかガジェットとか！
            </Grid>

        </div>
    );
};

export default HomeView;
