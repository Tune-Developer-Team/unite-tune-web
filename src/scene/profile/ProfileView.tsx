import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import {ProfileViewModel} from "./ProfileViewModel";
import Profile from "../../models/Profile/Profile";
import RoundedButton from "../../ui/button/RoundedButton";
import Avatar from "@mui/material/Avatar";
import Drawer from '@mui/material/Drawer';
import {Gauge} from "@mui/x-charts";
import {MenuItem, Select, SelectChangeEvent, Switch, TextField} from "@mui/material";
import {ImageUploadForm} from "../seedEdit/ImageUploadForm";
import {endPoint} from "../../consts/api";
import CURIOS_DIRECTION from "../../consts/curiosDirection";
import ImagePath from "../../models/data/ImagePath";
import {profileState} from "../../atoms/ProfileState";
import {loaderState} from "../../atoms/LoaderState";
import Loader from "../../ui/loading/Loader";
import CustomTabs from "../../ui/layout/CustomTabs";
import {topTabState} from "../../atoms/topTabState";

const profileViewModel = new ProfileViewModel();

const ProfileView = () => {
    // グローバルオブジェクト
    const [globalProfile, setGlobalProfile] = useRecoilState<Profile>(profileState)
    const [authState] = useRecoilState(authenticationState);
    const [loading, setLoading] = useRecoilState(loaderState);
    const [topTab] = useRecoilState<{ label: string }>(topTabState);

    // ViewModel
    const params = useParams();
    const uid = params.uid as string;
    const [viewModel, setViewModel] = useState<ProfileViewModel>(profileViewModel);

    // UI
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // Model
    const initProfile = viewModel.profile;
    // プロフィール編集
    const [newProfile, setNewProfile] = useState<Profile>(initProfile)

    // フォーム
    const [newIconImage, setNewIconImage] = useState<ImagePath|null>(null)
    const [isPublishedAis, setIsPublishedAis] = useState<boolean>(false)
    const [isShowPortfolio, setIsShowPortfolio] = useState<boolean>(false)
    const [isShowMbti, setIsShowMbti] = useState<boolean>(false)

    // ファイル変更時に受け取るコールバック関数
    const handleFileChange = async (iconImage: ImagePath) => {
        // プレビュー用画像
        setNewIconImage(iconImage);
    };

    const toggleDrawer = (open: boolean) => {
        // グローバルオブジェクトを深いコピーで更新
        const updatedProfile = Profile.initProfile();  // Profileの新しいインスタンスを作成 RecoilStateはイミュータブルなため。
        Object.assign(updatedProfile, viewModel.profile);
        setGlobalProfile(updatedProfile);

        setIsDrawerOpen(open);
    };

    const setUp = async (): Promise<void> => {
        const newViewModel = viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, uid: authState.uid,
        });
        await newViewModel.fetchUserProfile(uid);
        // トグルスイッチ初期化
        setIsPublishedAis(newViewModel.profile.isPublishedAis)
        setIsShowPortfolio(newViewModel.profile.isShowPortfolio)
        setIsShowMbti(newViewModel.profile.isShowMbti)
        // ビューモデル初期化
        setViewModel(newViewModel);

        // 自分のプロフィールの時
        if (uid === authState.uid) {
            // グローバルオブジェクトを深いコピーで更新
            const updatedProfile = Profile.initProfile();  // Profileの新しいインスタンスを作成 RecoilStateはイミュータブルなため。
            Object.assign(updatedProfile, newViewModel.profile);
            setGlobalProfile(updatedProfile);
        }

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
        <Box className="Profile" paddingLeft={1}>
            {topTab.label}
            <CustomTabs tabItems={viewModel.tabItems}></CustomTabs>
            <Loader/>
            <Grid container spacing={2} className={"header"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box width={"100%"} display={"flex"} paddingBottom={2} position="relative">
                        {/* 親要素を相対位置に設定 */}
                        <Box position="relative" width={100} height={100}>
                            {/* Gaugeを絶対位置に設定し、Avatarに沿わせる */}
                            <Gauge
                                width={140}
                                height={140}
                                value={viewModel.profile.curiosValue}
                                sx={{
                                    position: 'absolute',
                                    top: -19,
                                    left: -19
                                }}
                            />
                            <Avatar
                                alt="userIcon"
                                src={viewModel.profile.iconImage.path}
                                sx={{width: 100, height: 100, position: 'relative', zIndex: 1}} // Avatarを上に表示
                                onClick={() => {
                                    console.log("ユーザー");
                                }}
                            />
                        </Box>
                        <Box textAlign={"end"} width={"100%"} display={uid === authState.uid ? "block" : "none"}>
                            <RoundedButton onClick={() => toggleDrawer(true)}>
                                Edit
                            </RoundedButton>
                        </Box>
                    </Box>
                    <Typography variant="h6" component="div" sx={{textAlign: "start"}}>
                        {viewModel.profile.nickName}&nbsp;&nbsp;
                        {/*<Chip label={profile.curiosDirection} size="small" />*/}
                    </Typography>
                </Grid>
            </Grid>

            {/*Main*/}
            <Grid container sx={{display: topTab.label === 'Main' ? "block" : "none"}} spacing={2} className={"Main"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"description"}>
                    <div dangerouslySetInnerHTML={{__html: viewModel.profile.description.replace(/\n/g, '<br />')}}/>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12}>
                    MyCurios🚧開発中🚧
                    <Box>
                        {viewModel.profile.curios}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}
                      sx={{display: viewModel.profile.isPublishedAis ? "block" : "none"}}>
                    <Box>
                        AIS：&nbsp;&nbsp;{"🚧開発中🚧"}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} sx={{display: viewModel.profile.isShowMbti ? "block" : "none"}}>
                    <Box>
                        性格タイプ：&nbsp;&nbsp;{viewModel.profile.mbti}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}
                      sx={{display: viewModel.profile.isShowPortfolio ? "block" : "none"}}>
                    <Box>
                        <Button onClick={() => {
                            navigate(`/user/${uid}/portfolio`)
                        }}
                        >Please See Portfolio</Button>
                    </Box>
                </Grid>
            </Grid>

            {/*ThinkTank*/}
            <Grid container sx={{display: topTab.label === 'ThinkTank' ? "block" : "none"}} spacing={2} className={"ThinkTank"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"addThinkModal"}>
                    つぶやきの追加モーダル
                </Grid>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"timeLine"}>
                    自分のタイムライン
                </Grid>
            </Grid>

            {/*AIS*/}
            <Grid container sx={{display: topTab.label === 'AIS' ? "block" : "none"}} spacing={2} className={"AIS"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"threeDView"}>
                    3Dビューでクラッピーくんが表示される
                </Grid>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"description"}>
                    model: Crappy<br/>
                    LearningLevel: 29<br/>
                </Grid>
            </Grid>

            {/*Goods*/}
            <Grid container sx={{display: topTab.label === 'Goods' ? "block" : "none"}} spacing={2} className={"Goods"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"tab"}>
                切り替えのタブ
                </Grid>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"table"}>
                自分の読んだ本とかのテーブル
                </Grid>
            </Grid>
            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => toggleDrawer(false)}
                sx={{'& .MuiDrawer-paper': {padding: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20}}}
            >
                <Box sx={{width: 'auto', padding: 2}}>
                    <Box display={"flex"}>
                        <Typography width={"100%"} textAlign={"start"} color={"#f6f6f6"} onClick={async () => {
                            setNewIconImage(null);
                            toggleDrawer(false)
                        }
                        } sx={{font: 'bold'}}>
                            キャンセル
                        </Typography>
                        <Typography width={"100%"} textAlign={"end"} color={"#325eff"} onClick={async () => {
                            if (newIconImage !== null) {
                                newProfile.iconImage = newIconImage;
                            }
                            await viewModel.updateProfile(uid, newProfile);

                            if (newIconImage !== null) {
                                newProfile.iconImage = initProfile.iconImage
                            }
                            setViewModel(viewModel);
                            toggleDrawer(false)
                        }
                        } sx={{font: 'bold'}}>
                            完了
                        </Typography>
                    </Box>
                    <div className="ProfileEditUI">
                        <Grid container spacing={2} className={"projectByLanguage"}>
                            <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                                <Box width={"100%"} position={"relative"} paddingBottom={2}>
                                    <Avatar
                                        alt="userIcon"
                                        src={!newIconImage ? viewModel.profile.iconImage.path : newIconImage.path}
                                        sx={{width: 100, height: 100, position: 'relative', xIndex: 1}}
                                        onClick={() => {
                                            console.log("ユーザー");
                                        }}
                                    />
                                    <Box
                                        component="form"
                                        sx={{
                                            position: 'absolute',
                                            top: 40,
                                            left: 0,
                                            width: 100,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0,0,0,0.5)', // 半透明の背景色
                                            zIndex: 2, // フォームをアバターの上に表示
                                        }}
                                    >
                                        <ImageUploadForm onFileChange={handleFileChange}
                                                         folderName={viewModel.authState.getUid()}
                                                         uploadEndPoint={endPoint.UPLOAD_PROFILE_File}/>
                                    </Box>
                                </Box>
                                <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                                    <TextField
                                        fullWidth
                                        required
                                        rows={1}
                                        variant="standard"
                                        hiddenLabel
                                        defaultValue={viewModel.profile.nickName}
                                        onChange={(event) => {
                                            newProfile.nickName = event.target.value;
                                            setNewProfile(newProfile);
                                        }}
                                    />
                                </Box>
                            </Grid>
                            {/*詳細*/}
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                自己紹介
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                                    <TextField
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        variant="standard"
                                        hiddenLabel
                                        defaultValue={viewModel.profile.description}
                                        onChange={(event) => {
                                            newProfile.description = event.target.value;
                                            setNewProfile(newProfile)
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid xs={12} sm={12} md={12} lg={12}>
                                興味
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.2rem"}}>
                                    <TextField
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        variant="standard"
                                        hiddenLabel
                                        defaultValue={viewModel.profile.curios}
                                        onChange={(event) => {
                                            newProfile.curios = event.target.value;
                                            setNewProfile(newProfile)
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    CuriosGaugeの自動設定
                                </Box>
                                <Select
                                    labelId="profile-curios-direction"
                                    id="profile-curios-direction"
                                    value={viewModel.profile.curiosDirection.label}
                                    label="CuriosDirection"
                                    onChange={(event: SelectChangeEvent) => {
                                        const label = event.target.value;
                                        newProfile.curiosDirection.kind = CURIOS_DIRECTION.find(item => item.label === label)?.kind ?? 0
                                        setNewProfile(newProfile)
                                    }}
                                >
                                    <MenuItem value={"高"}>高</MenuItem>
                                    <MenuItem value={"中"}>中</MenuItem>
                                    <MenuItem value={"低"}>低</MenuItem>
                                    <MenuItem value={"手動"}>手動</MenuItem>
                                </Select>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    AIS
                                    <Switch
                                        checked={isPublishedAis}
                                        onChange={(event, checked) => {
                                            setIsPublishedAis(checked)
                                            newProfile.isPublishedAis = checked;
                                            setNewProfile(newProfile);
                                        }}
                                        name="IsPublishedAis"
                                        color="primary"
                                    />
                                    {viewModel.profile.isPublishedAis ? "公開する" : "公開しない"}
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    ポートフォリオ
                                    <Switch
                                        checked={isShowPortfolio}
                                        onChange={(event, checked) => {
                                            setIsShowPortfolio(checked)
                                            newProfile.isShowPortfolio = checked;
                                            setNewProfile(newProfile);
                                        }}
                                        name="isShowMbti"
                                        color="primary"
                                    />
                                    {viewModel.profile.isShowPortfolio ? "公開する" : "公開しない"}
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box>
                                    性格タイプ
                                    <Switch
                                        checked={isShowMbti}
                                        onChange={(event, checked) => {
                                            setIsShowMbti(checked)
                                            newProfile.isShowMbti = checked;
                                            setNewProfile(newProfile);
                                        }}
                                        name="isShowMbti"
                                        color="primary"
                                    />
                                    {viewModel.profile.isShowMbti ? "公開する" : "公開しない"}
                                </Box>
                                {/*{mbti}*/}
                                <Select
                                    labelId="profile-mbti"
                                    id="profile-mbti"
                                    value={viewModel.profile.mbti}
                                    label="Mbti"
                                    disabled={!newProfile.isShowMbti}
                                    onChange={(event: SelectChangeEvent) => {
                                        newProfile.mbti = event.target.value.toString()
                                        setNewProfile(newProfile)
                                    }
                                    }
                                >
                                    <MenuItem value={"建築家(INTJ-A)"}>建築家(INTJ-A)</MenuItem>
                                    <MenuItem value={"建築家(INTJ-T)"}>建築家(INTJ-T)</MenuItem>
                                    <MenuItem value={"論理学者(INTP-A)"}>論理学者(INTP-A)</MenuItem>
                                    <MenuItem value={"論理学者(INTP-T)"}>論理学者(INTP-T)</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Drawer>
        </Box>
    );
};

export default ProfileView;
