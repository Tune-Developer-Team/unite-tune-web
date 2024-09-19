import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {navigationState} from "../atoms/NavigationState";
import aiIcon from "../assets/ais.svg";
import Button from "@mui/material/Button";
import {Box, LinearProgress} from "@mui/material";
import AttendanceManagement from "../ui/AttendanceManagement";

const AISecretary = () => {
    const [navigation, setNavigation] = useRecoilState(navigationState);

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
    }, []);

    return (
        <div className="Home" style={{paddingLeft: '5rem'}}>
            <Grid container spacing={2} className={"aisHome"}>
                <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        <img src={aiIcon}/>️ AIS (AISecretary)
                    </Typography>
                    <br/>
                    <Typography>
                        あなたに最適化されたAI秘書を<br/>絶賛開発中！<br/>近日リリース予定！<br/><br/>
                    </Typography>
                </Grid>
                <br/>
                <br/>
                <br/>
                <Box>
                    <Typography variant="h4" component="div">
                        勤怠登録
                    </Typography>
                    <AttendanceManagement/>
                </Box>
            </Grid>
        </div>
    );
};

export default AISecretary;
