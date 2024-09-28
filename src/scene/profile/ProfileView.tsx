import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRecoilState } from "recoil";
import { authenticationState } from "../../atoms/AuthenticationState";
import { navigationState } from "../../atoms/NavigationState";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileViewModel } from "./ProfileViewModel";
import Profile from "../../models/Profile/Profile";
import RoundedButton from "../../ui/button/RoundedButton";
import Avatar from "@mui/material/Avatar";

const profileViewModel = new ProfileViewModel();

const ProfileView = () => {
    const params = useParams();
    const uId = params.uid as string;

    const [viewModel] = useState<ProfileViewModel>(profileViewModel);
    const [targetUid] = useState<string>(uId);
    const navigate = useNavigate();
    const [authState] = useRecoilState(authenticationState);
    const [profile, setProfile] = useState<Profile>(viewModel.profile);
    const [navigation, setNavigation] = useRecoilState(navigationState);

    const setUp = async (): Promise<void> => {
        const newViewModel = await viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, uId: targetUid,
        });
        // setViewModel(newViewModel);
        setProfile(newViewModel.getProfile());
    }

    useEffect(() => {
        setNavigation({ isHidden: false, isEnableRedirect: true });
        // セットアップ
        void setUp();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    },[]);

    return (
        <div className="Home" style={{ paddingLeft: '5rem' }}>
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid paddingBottom={12} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box width={"100%"} display={"flex"} paddingBottom={2}>
                        <Avatar
                            alt="userIcon"
                            src={profile.iconImage.path}
                            sx={{ width: 100, height: 100 }} // サイズを大きくする
                            onClick={() => {
                                console.log("ユーザー");
                            }}
                        />
                        <Box textAlign={"end"} width={"100%"} display={uId === authState.uid ? "block" : "none"}>
                            <RoundedButton onClick={() => {
                                console.log("編集")
                            }}>
                                Edit
                            </RoundedButton>
                        </Box>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ textAlign: "start" }}>
                        {profile.nickName}
                    </Typography>
                </Grid>

                <Grid xs={6} sm={6} md={6} lg={6}>
                    <Box sx={{ textAlign: "start" }}>
                        <Typography>
                            自分でも気づかない自分の自己紹介データが見られる。<br />現在開発中
                        </Typography>
                        {/*<ProfileBarChart/>*/}
                    </Box>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} sx={{ textAlign: "center" }}>
                    <Typography variant="h6" component="div" sx={{ textAlign: "center" }}>
                        ⚡️ My Values
                    </Typography>
                    <Box>
                        <Button onClick={() => {
                            navigate(`/user/${uId}/portfolio`)
                        }}
                        >Please See Portfolio</Button>
                    </Box>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={3}>
                </Grid>
                <Grid sx={{ textAlign: "center" }} xs={6} sm={6} md={6} lg={6}>

                </Grid>
                <Grid xs={3} sm={3} md={3} lg={3}>
                </Grid>

            </Grid>
        </div>
    );
};

export default ProfileView;
