import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import Button from "@mui/material/Button";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {ProfileViewModel} from "./ProfileViewModel";
import Profile from "../../models/Profile/Profile";
import RoundedButton from "../../ui/button/RoundedButton";
import Avatar from "@mui/material/Avatar";
import Drawer from '@mui/material/Drawer';
import {Gauge} from "@mui/x-charts";
import {MenuItem, Select, SelectChangeEvent, Switch, TextField} from "@mui/material";
import {endPoint} from "../../consts/api";
import CURIOS_DIRECTION from "../../consts/curiosDirection";
import ImagePath from "../../models/data/ImagePath";
import {profileState} from "../../atoms/ProfileState";
import {loaderState} from "../../atoms/LoaderState";
import Loader from "../../ui/loading/Loader";
import CustomTabs from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import threeDModel from "../crappy/crappy.png";
import generateCuriosTagChips from "../../ui/curiosTag/CuriosTagChips";
import CuriosTagInput from "../../ui/curiosTag/CuriosTagInput";
import {ImageUploadForm} from "./ImageUploadForm";
import MyThinkTank from "./ThinkTankTab/MyThinkTank";

const ProfileView = () => {
    // グローバルオブジェクト
    const [authState] = useRecoilState(authenticationState);
    const [globalProfile, setGlobalProfile] = useRecoilState<Profile>(profileState)
    const [loading, setLoading] = useRecoilState(loaderState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

    // ViewModel
    const params = useParams();
    const uid = params.uid as string;
    const [viewModel, setViewModel] = useState<ProfileViewModel>(new ProfileViewModel(authState));

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
    const [newTags, setNewTags] = useState<string[]>([]);

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
        setNewTags(newViewModel.profile.curios)
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
            <CustomTabs tabItems={viewModel.tabItems} bottomTab={'Profile'}/>
            <Loader/>
            <Grid container spacing={2} className={"header"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box width={"100%"} display={"flex"} paddingBottom={0} position="relative">
                        {/* 親要素を相対位置に設定 */}
                        <Box position="relative" width={100} height={100}>
                            {/* Gaugeを絶対位置に設定し、Avatarに沿わせる */}
                            <Gauge
                                width={116}
                                height={116}
                                value={viewModel.profile.curiosValue}
                                sx={{
                                    position: 'absolute',
                                    top: -18,
                                    left: -18
                                }}
                            />
                            <Avatar
                                alt="userIcon"
                                src={viewModel.profile.iconImage.path}
                                sx={{width: 80, height: 80, position: 'relative', zIndex: 1}} // Avatarを上に表示
                                onClick={() => {
                                    console.log("ユーザー");
                                }}
                            />
                        </Box>
                        <Box width={"100%"}>
                            <Typography variant="h6" component="div" sx={{textAlign: "start"}} paddingLeft={3}>
                                {viewModel.profile.nickName}&nbsp;&nbsp;
                                {/*<Chip label={profile.curiosDirection} size="small" />*/}
                            </Typography>
                            <Box textAlign={"end"} width={"100%"} display={uid === authState.uid ? "block" : "none"}>
                                <RoundedButton onClick={() => toggleDrawer(true)}>
                                    Edit
                                </RoundedButton>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Outlet context={{viewModel, setViewModel}}/>

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
                            // 画像の更新
                            if (newIconImage !== null) {
                                newProfile.iconImage = newIconImage;
                            }

                            // タグの更新
                            newProfile.curios = newTags
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
                                                         folderName={viewModel.generateFolderName()}
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
                                Curios
                            </Grid>
                            <Grid xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.2rem"}}>
                                    <CuriosTagInput tags={newTags} setTags={setNewTags} />
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
                                    <MenuItem value={"指揮官(ENTJ-A)"}>指揮官(ENTJ-A)</MenuItem>
                                    <MenuItem value={"指揮官(ENTJ-T)"}>指揮官(ENTJ-T)</MenuItem>
                                    <MenuItem value={"討論者(ENTP-A)"}>討論者(ENTP-A)</MenuItem>
                                    <MenuItem value={"討論者(ENTP-T)"}>討論者(ENTP-T)</MenuItem>
                                    <MenuItem value={"提唱者(INFJ-A)"}>提唱者(INFJ-A)</MenuItem>
                                    <MenuItem value={"提唱者(INFJ-T)"}>提唱者(INFJ-T)</MenuItem>
                                    <MenuItem value={"仲介者(INFP-A)"}>仲介者(INFP-A)</MenuItem>
                                    <MenuItem value={"仲介者(INFP-T)"}>仲介者(INFP-T)</MenuItem>
                                    <MenuItem value={"主人公(ENFJ-A)"}>主人公(ENFJ-A)</MenuItem>
                                    <MenuItem value={"主人公(ENFJ-T)"}>主人公(ENFJ-T)</MenuItem>
                                    <MenuItem value={"広報運動家(ENFP-A)"}>広報運動家(ENFP-A)</MenuItem>
                                    <MenuItem value={"広報運動家(ENFP-T)"}>広報運動家(ENFP-T)</MenuItem>
                                    <MenuItem value={"管理者(ISTJ-A)"}>管理者(ISTJ-A)</MenuItem>
                                    <MenuItem value={"管理者(ISTJ-T)"}>管理者(ISTJ-T)</MenuItem>
                                    <MenuItem value={"擁護者(ISFJ-A)"}>擁護者(ISFJ-A)</MenuItem>
                                    <MenuItem value={"擁護者(ISFJ-T)"}>擁護者(ISFJ-T)</MenuItem>
                                    <MenuItem value={"巨匠(ISTP-A)"}>巨匠(ISTP-A)</MenuItem>
                                    <MenuItem value={"巨匠(ISTP-T)"}>巨匠(ISTP-T)</MenuItem>
                                    <MenuItem value={"冒険者(ISFP-A)"}>冒険者(ISFP-A)</MenuItem>
                                    <MenuItem value={"冒険者(ISFP-T)"}>冒険者(ISFP-T)</MenuItem>
                                    <MenuItem value={"幹部(ESTJ-A)"}>幹部(ESTJ-A)</MenuItem>
                                    <MenuItem value={"幹部(ESTJ-T)"}>幹部(ESTJ-T)</MenuItem>
                                    <MenuItem value={"領事(ESFJ-A)"}>領事(ESFJ-A)</MenuItem>
                                    <MenuItem value={"領事(ESFJ-T)"}>領事(ESFJ-T)</MenuItem>
                                    <MenuItem value={"起業家(ESTP-A)"}>起業家(ESTP-A)</MenuItem>
                                    <MenuItem value={"起業家(ESTP-T)"}>起業家(ESTP-T)</MenuItem>
                                    <MenuItem value={"エンターテイナー(ESFP-A)"}>エンターテイナー(ESFP-A)</MenuItem>
                                    <MenuItem value={"エンターテイナー(ESFP-T)"}>エンターテイナー(ESFP-T)</MenuItem>

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
