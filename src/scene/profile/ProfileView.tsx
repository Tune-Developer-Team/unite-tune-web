import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import {useRecoilState} from "recoil";
import {profileState} from "../../atoms/ProfileState";
import {authenticationState} from "../../atoms/AuthenticationState";
import Avatar from "@mui/material/Avatar";
import ProfileBarChart from "../../ui/chart/ProfileBarChart";
import TaskListTable from "../../ui/table/taskListTable";
import {navigationState} from "../../atoms/NavigationState";

const ProfileView = () => {
    const [authentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [navigation, setNavigation] = useRecoilState(navigationState);

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
}, []);

    return (
        <div className="Home" style={{paddingLeft: '5rem'}}>
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        🍔 Profile
                    </Typography>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} >
                    <Typography variant="h6" component="div" sx={{textAlign: "center"}}>
                        💻 My Skill Set
                    </Typography>
                    <Box sx={{textAlign:"start"}}>
                        <ProfileBarChart/>
                    </Box>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} sx={{textAlign: "center"}}>
                    <Box sx={{textAlign:"start"}}>
                        <Typography>
                            山田 太郎
                        </Typography>
                    </Box>
                </Grid>


                <Grid xs={3} sm={3} md={3} lg={3} >
                </Grid>
                <Grid sx={{textAlign: "center"}} xs={6} sm={6} md={6} lg={6}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        ⚡️ My Portfolio
                    </Typography>
                </Grid>
                <TaskListTable/>
                <Grid xs={3} sm={3} md={3} lg={3} >
                </Grid>

            </Grid>
        </div>
    );
};

export default ProfileView;
