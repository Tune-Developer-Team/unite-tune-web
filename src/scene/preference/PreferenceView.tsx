import React, {useEffect, useState} from 'react';

import {useRecoilState} from "recoil";
import {Button} from "@mui/material";
import {authenticationState} from "../../atoms/AuthenticationState";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {v4 as uuidv4} from "uuid";
import {navigationState} from "../../atoms/NavigationState";
import {TuneCard} from "../../models/TuneCard/TuneCard";
import {tuneCardState} from "../../atoms/TuneCardState";

const PreferenceView: React.FunctionComponent = () => {
    const [authentication, setAuthentication] = useRecoilState(authenticationState);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [tuneCard, setTuneCard] = useRecoilState<TuneCard>(tuneCardState);

    const signOut = (): void => {
        // googleLogout();
        setAuthentication({uid:''});
    }

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
    }, []);

    return (
        <Grid container spacing={2} className={"preference"}>
            <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h5" component="div">
                    設定
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h6" component="div">
                    UID : {authentication.uid}
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h6" component="div">
                    TuneCard : {tuneCard.serial}
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h6" component="div">
                    GoogleAccount : {authentication.email}
                </Typography>
            </Grid>

            <Grid sx={{textAlign: "end"}} xs={6} sm={6} md={6} lg={6}>
                <Button onClick={signOut}>サインアウト
                </Button>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={6} sm={6} md={6} lg={6}>
                <Button onClick={()=>{console.log('←アカウントを破棄するらしいコイツ')}}>アカウントを破棄する</Button>
            </Grid>
        </Grid>
    );
};
export default PreferenceView;
