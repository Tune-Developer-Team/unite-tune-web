import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {profileState} from "../../../atoms/ProfileState";
import {loaderState} from "../../../atoms/LoaderState";
import {ProfileViewModel} from "../ProfileViewModel";
import {SelectedTabIF, selectedTabState} from "../../../atoms/SelectedTabState";
import {Button} from "@mui/material";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import ImagePath from "../../../models/data/ImagePath";
import generateCuriosTagChips from "../../../ui/curiosTag/CuriosTagChips";
import {authenticationState} from "../../../atoms/AuthenticationState";
import Profile from "../../../models/Profile/Profile";
import {Think} from "../../../models/ThinkTank/Think";

const MainTab = () => {
    // グローバルオブジェクト
    const [authState] = useRecoilState(authenticationState);
    const [globalProfile, setGlobalProfile] = useRecoilState<Profile>(profileState)
    const [loading, setLoading] = useRecoilState(loaderState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

    const { viewModel, setViewModel} = useOutletContext<{
        viewModel: ProfileViewModel,
        setViewModel: React.Dispatch<React.SetStateAction<ProfileViewModel>>
    }>();

    // ViewModel
    const params = useParams();
    const uid = params.uid as string;

    // UI
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // Model
    const initProfile = viewModel.profile;
    // プロフィール編集
    const [newProfile, setNewProfile] = useState<Profile>(initProfile)

    // フォーム
    const [newIconImage, setNewIconImage] = useState<ImagePath | null>(null)
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
        <Grid container spacing={2}
              className={"Main"}>
            <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"description"}>
                <div dangerouslySetInnerHTML={{__html: viewModel.profile.description.replace(/\n/g, '<br />')}}/>
            </Grid>

            <Grid xs={12} sm={12} md={12} lg={12}>
                MyCurios
                <Box>
                    {generateCuriosTagChips(viewModel.profile.curios)}
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
    );
}

export default MainTab