import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {useNavigate, useParams} from "react-router-dom";
import {QuestViewModel, SaveQuestParamIF} from "./QuestViewModel";
import Avatar from "@mui/material/Avatar";
import Drawer from '@mui/material/Drawer';
import {Switch, TextField} from "@mui/material";
import ImagePath from "../../models/data/ImagePath";
import {loaderState} from "../../atoms/LoaderState";
import Loader from "../../ui/loading/Loader";
import CustomTabs, {TabItem} from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import {QuestDetail} from "../../models/Quest/Quest";
import ScrollContainer from "../../ui/container/ScrollContainer";
import RoundedButton from "../../ui/button/RoundedButton";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {ImageUploadForm} from "../seedEdit/ImageUploadForm";
import {endPoint} from "../../consts/api";
import IconButton from "@mui/material/IconButton";
import {Api} from "../../models/Api/Api";
import generateCuriosTagChips from "../../ui/curiosTag/CuriosTagChips";
import CuriosTagInput from "../../ui/curiosTag/CuriosTagInput";

const questViewModel = new QuestViewModel();

const QuestView = () => {
    // グローバルオブジェクト
    const [authState] = useRecoilState(authenticationState);
    const [loading, setLoading] = useRecoilState(loaderState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

    // ViewModel
    const params = useParams();
    const questId = params.questId as string;
    const [viewModel, setViewModel] = useState<QuestViewModel>(questViewModel);

    // タブメニュー
    const tabItems: TabItem[] = [
        {label: '概要'},
        {label: '条件'},
        {label: '報酬'}
    ];

    // UI
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // Model
    const initialQuestDetail = viewModel.questDetail;
    const [newQuestDetail, setNewQuestDetail] = useState<QuestDetail>(initialQuestDetail)
    // const [newIconImage, setNewIconImage] = useState<ImagePath | null>(null) // TODO: 画像未実装
    const [isShowDetailSetting, setIsShowDetailSetting] = useState<boolean>(false)
    const [imagePathList, setImagePathList] = useState<ImagePath[]>([]);
    const [newTags, setNewTags] = useState<string[]>([]);

    // ファイル変更時に受け取るコールバック関数
    const handleFileChange = async (imagePath: ImagePath) => {
        // アップロード済みの画像パスをリストに追加
        setImagePathList((prevList: ImagePath[]) => [...prevList, imagePath]);
    };

    // 画像削除処理
    const handleImageDelete = async (index: number, imagePath: ImagePath) => {
        const api = new Api(viewModel.authState);
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

    // ドロワー終了
    const toggleDrawer = (open: boolean) => {
        // グローバルオブジェクトを深いコピーで更新
        const updatedQuest = QuestDetail.initQuestDetail();  // Questの新しいインスタンスを作成 RecoilStateはイミュータブルなため。
        Object.assign(updatedQuest, viewModel.questDetail);
        setNewQuestDetail(updatedQuest)

        setIsDrawerOpen(open);
    };

    // 内容を保存する
    const saveQuest = async (model: QuestDetail): Promise<void> => {
        const saveQuestParam: SaveQuestParamIF = {
            questId: questId,
            ownerUserUid: authState.uid as string,
            isPublished: model.isPublished,
            title: model.title,
            description: model.description,
            benefit: model.benefit,
            imagePathList: JSON.stringify(model.imagePathList),
            termsFrom: 0, // TODO: 仮
            termsTo: 0, // TODO: 仮
            hashTagStringList: JSON.stringify(model.hashTagStringList),
            relationQuestIdList: JSON.stringify([]), // TODO: 未実装_関連するSeedを指定する機能
            mentionList: JSON.stringify([]) // TODO: 未実装_メンション_ユーザーにメンションできる機能
        };

        await viewModel.saveQuest(saveQuestParam);
    }

    const setUp = async (): Promise<void> => {
        const newViewModel = viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, uid: authState.uid,
        });
        await newViewModel.fetchQuest(questId);

        //　新規追加
        if (newViewModel.questDetail.title === '') {
            toggleDrawer(true);
        }

        // ビューモデル初期化
        setViewModel(newViewModel);

        // グローバルオブジェクトを深いコピーで更新
        const updatedQuest = QuestDetail.initQuestDetail();  // Questの新しいインスタンスを作成 RecoilStateはイミュータブルなため。
        Object.assign(updatedQuest, newViewModel.getQuestDetail());
        setNewQuestDetail(updatedQuest);

        console.log(newQuestDetail)

        setLoading({isLoading: false});
    }

    useEffect(() => {
        void setUp();
        setLoading({isLoading: true})
        return () => {
            viewModel.cleanUp();
        };
    }, []);

    return (
        <Box className="QuestDetail" paddingLeft={1}>
            <CustomTabs tabItems={tabItems} bottomTab={'QuestDetail'}/>
            <Loader/>
            {/*CoverImage*/}
            <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                <Box paddingBottom={2}
                     sx={{display: {xs: "block", s: "block", md: "none", lg: "none", xl: "none"}}}>
                    <img src={newQuestDetail.imagePathList[0]?.path ?? ""}
                         alt={newQuestDetail.imagePathList[0]?.alt ?? "seedIcon"}
                         style={{objectFit: "cover"}}
                         width={350}
                         height={350}
                    />
                </Box>
            </Grid>

            {/*Title*/}
            <Grid container spacing={2}>
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{display: "flex"}}>
                        <Box sx={{textAlign: "start"}}>
                            <Typography fontSize={"1.3rem"}>
                                <div dangerouslySetInnerHTML={{__html: newQuestDetail.title}}/>
                            </Typography>
                        </Box>
                        <Box sx={{textAlign: "end"}} width={"100%"}>
                            <RoundedButton onClick={() => {
                            }}>
                                気になる
                            </RoundedButton>
                        </Box>
                    </Box>
                </Grid>

                {/*Description*/}
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{textAlign: "start"}}>
                        <Typography variant={"h6"}>
                            依頼内容
                        </Typography>
                        <Typography>
                            <div dangerouslySetInnerHTML={{__html: newQuestDetail.description}}/>
                        </Typography>
                    </Box>
                </Grid>

                {/*Benefit*/}
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{textAlign: "start"}}>
                        <Typography variant={"h6"}>
                            報酬
                        </Typography>
                        <Typography>
                            {newQuestDetail.benefit.substring(0, 38).replace(/<a[^>]*>(.*?)<\/a>/gi, '')}
                        </Typography>
                    </Box>
                </Grid>

                {/*CuriosTags*/}
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{textAlign: "start"}}>
                        <Typography>
                            {generateCuriosTagChips(newQuestDetail.hashTagStringList)}
                        </Typography>
                    </Box>
                </Grid>

                {/*RelationalUser*/}
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12} paddingTop={4}>
                    <Typography fontSize={"1.3rem"}>
                        関連ユーザー
                    </Typography>
                    <ScrollContainer>
                        <Box textAlign={"start"} position={"relative"}>
                            <Avatar
                                alt="userIcon"
                                sizes={"ss"}
                                src={"pathName"}
                                onClick={() => {
                                    navigate(`/user/${newQuestDetail.ownerUserUid}`);
                                }}
                            />
                            <span style={{fontSize: "0.7rem"}} color={"#fff"}>
                                <span>
                                    {newQuestDetail.ownerUserName}山田太郎
                                </span>
                                <Box
                                    border={"solid thin #fff"}
                                    textAlign={"center"}
                                    borderRadius={1}
                                    padding={0.2}
                                    fontSize={12}
                                    sx={{backgroundColor: "#ff4444"}}
                                >
                                オーナー
                            </Box>
                        </span>
                        </Box>
                    </ScrollContainer>
                </Grid>
            </Grid>

            {/*OwnerMenu*/}
            <Grid textAlign={"start"} width={"100%"} xs={12} sm={12} md={12} lg={12} paddingTop={4}
                  display={newQuestDetail.ownerUserUid === authState.uid ? "flex" : "none"}
            >
                <Box textAlign={"center"} width={"100%"}>
                    <RoundedButton onClick={() => toggleDrawer(true)}>
                        Edit
                    </RoundedButton>
                </Box>
            </Grid>
            {/*EditDrawer*/}
            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => toggleDrawer(false)}
                sx={{'& .MuiDrawer-paper': {padding: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20}}}
            >
                <Box display={"flex"} paddingBottom={4}>
                    <Typography width={"100%"} textAlign={"start"} color={"#f6f6f6"} onClick={async () => {

                        // SPEC: タイトルが空のままでは閉じさせない
                        if (newQuestDetail.title == '') {
                            return
                        }
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

                        // キュリオスタグの更新
                        newQuestDetail.hashTagStringList = newTags

                        // モデルインスタンスの更新
                        setNewQuestDetail(newQuestDetail);

                        // DBへ保存
                        await saveQuest(newQuestDetail);

                        // ビューモデルの更新
                        viewModel.questDetail = newQuestDetail;
                        setViewModel(viewModel);

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

                    {/*画像*/}
                    <Grid xs={12} sm={12} md={12} lg={12}>
                        <ImageUploadForm onFileChange={handleFileChange}
                                         folderName={questId}
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

                    <Grid xs={12} sm={12} md={12} lg={12} paddingBottom={4}>
                        {/*TODO: CuriosTag設定実装*/}
                        <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.2rem"}}>
                            <CuriosTagInput tags={newTags} setTags={setNewTags}/>
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

                    <Grid xs={12} sm={12} md={12} lg={12} textAlign={"center"} paddingTop={10} paddingBottom={10}>
                        <RoundedButton onClick={() => {
                            if (window.confirm('この依頼を完全に削除しますか？')) {
                                console.log("Delete Quest");
                            } else {
                                // 何もしない
                            }
                        }}>
                            <Typography color={'#ff1818'}>
                                Delete
                            </Typography>
                        </RoundedButton>
                    </Grid>

                </Grid>
            </Drawer>
        </Box>
    );
};

export default QuestView;
