import React, {useEffect, useState} from 'react';

import {useRecoilState, useResetRecoilState} from "recoil";
import {Button, Switch, TextField} from "@mui/material";
import {authenticationState, AuthenticationStateIF} from "../../atoms/AuthenticationState";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {TuneCard} from "../../models/TuneCard/TuneCard";
import {tuneCardState} from "../../atoms/TuneCardState";
import {dblogState} from "../../atoms/dblogState";
import Box from "@mui/material/Box";
import Authentication from "../../models/Authentication/Authentication";

const PreferenceView: React.FunctionComponent = () => {
    const [authState, setAuthState] = useRecoilState(authenticationState);
    const [tuneCard, setTuneCard] = useRecoilState<TuneCard>(tuneCardState);

    // dblog連携
    const [dblog, setDblog] = useRecoilState(dblogState);

    const googleLogout = useResetRecoilState(authenticationState);

    const signOut = (): void => {
        // ユーザーの認証情報のストアを更新
        googleLogout();
    }

    useEffect(() => {
    }, []);

    return (
        <Grid container spacing={2} className={"preference"}>
            <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h5" component="div">
                    設定
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                UID :
                <Typography variant="body2" component="div">
                    {authState.uid}
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                TuneCard :
                <Typography variant="body2" component="div">
                    {tuneCard.serial}
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                GoogleAccount :
                <Typography variant="body2" component="div">
                    {authState.email}
                </Typography>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                <Box
                    paddingBottom={2}
                    display={"flex"}
                >
                    dblog111連携 :
                </Box>
                    <TextField
                        fullWidth
                        label="ペンネーム"
                        variant="outlined"
                        value={dblog.penName}
                        onChange={(event) => {
                            setDblog({penName: event.target.value});
                        }}
                    />
            </Grid>

            <Grid sx={{textAlign: "end"}} xs={6} sm={6} md={6} lg={6}>
                <Button onClick={signOut}>サインアウト
                </Button>
            </Grid>
            <Grid sx={{textAlign: "start"}} xs={6} sm={6} md={6} lg={6}>
                <Button onClick={() => {
                    console.log('←アカウントを破棄するらしいコイツ')
                }}>アカウントを破棄する</Button>
            </Grid>
        </Grid>
    );
};
export default PreferenceView;
