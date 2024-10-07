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
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ProfileEditUI from "./ProfileEditUI";
import { Gauge } from "@mui/x-charts";
import {Chip} from "@mui/material";

const profileViewModel = new ProfileViewModel();

const ProfileView = () => {
    const params = useParams();
    const uId = params.uid as string;

    const [viewModel] = useState<ProfileViewModel>(profileViewModel);
    const [targetUid] = useState<string>(uId);
    const navigate = useNavigate();
    const [authState] = useRecoilState(authenticationState);
    const [profile, setProfile] = useState<Profile>(viewModel.profile);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    const setUp = async (): Promise<void> => {
        const newViewModel = await viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, uId: targetUid,
        });
        setProfile(newViewModel.getProfile());
    }

    useEffect(() => {
        void setUp();

        return () => {
            viewModel.cleanUp();
        };
    }, []);

    return (
        <Box className="Profile" paddingLeft={1}>
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box width={"100%"} display={"flex"} paddingBottom={2} position="relative">
                        {/* 親要素を相対位置に設定 */}
                        <Box position="relative" width={100} height={100}>
                            {/* Gaugeを絶対位置に設定し、Avatarに沿わせる */}
                            <Gauge
                                width={140}
                                height={140}
                                value={profile.curiosValue}
                                sx={{
                                    position: 'absolute',
                                    top: -19,
                                    left: -19
                                }}
                            />
                            <Avatar
                                alt="userIcon"
                                src={profile.iconImage.path}
                                sx={{ width: 100, height: 100, position: 'relative', zIndex: 1 }} // Avatarを上に表示
                                onClick={() => {
                                    console.log("ユーザー");
                                }}
                            />
                        </Box>
                        <Box textAlign={"end"} width={"100%"} display={uId === authState.uid ? "block" : "none"}>
                            <RoundedButton onClick={() => toggleDrawer(true)}>
                                Edit
                            </RoundedButton>
                        </Box>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ textAlign: "start" }}>
                        {profile.nickName}&nbsp;&nbsp;
                        <Chip label={profile.curiosDirection} size="small" />
                    </Typography>
                </Grid>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    {profile.description}
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    MyCurios
                    <Box>
                        {profile.curios}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} sx={{display: profile.isPublicAis ? "block" : "none"}}>
                    <Box>
                        AIS：&nbsp;&nbsp;{"🚧開発中🚧"}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} sx={{display: profile.isShowMbti ? "block" : "none"}}>
                    <Box>
                        性格タイプ：&nbsp;&nbsp;{profile.mbti}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} sx={{display: profile.isShowPortfolio ? "block" : "none"}}>
                    <Box>
                        <Button onClick={() => {
                            navigate(`/user/${uId}/portfolio`)
                        }}
                        >Please See Portfolio</Button>
                    </Box>
                </Grid>
            </Grid>
            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => toggleDrawer(false)}
                sx={{ '& .MuiDrawer-paper': { padding: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20 } }} // 丸みをつける
            >
                <Box sx={{ width: 'auto', padding: 2 }}>
                    <Typography color={"#325eff"} onClick={() => {
                        toggleDrawer(false)}
                        // TODO: データのリフレッシュ
                    }
                                sx={{ float: 'right', font: 'bold'}}>
                        完了
                    </Typography>
                    <ProfileEditUI profile={profile}/>
                </Box>
            </Drawer>
        </Box>
    );
};

export default ProfileView;
