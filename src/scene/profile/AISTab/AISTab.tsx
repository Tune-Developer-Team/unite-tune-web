import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {SelectedTabIF, selectedTabState} from "../../../atoms/SelectedTabState";
import threeDModel from "./crappy.png";

const AISTab = () => {
    // グローバルオブジェクト
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

    return (
        <Grid container spacing={2} className={"AIS"}>
            <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"threeDView"}>
                <Box className={"threeDView"}>
                    <Grid xs={12} sm={12} md={12} lg={12} sx={{padding: 0}}>
                        <img src={threeDModel} alt={"crappy-image"} width={"100%"}/>
                    </Grid>
                </Box>
            </Grid>
            <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"description"}>
                model: Crappy<br/>
                LearningLevel: 29<br/>
                🚧開発中🚧
            </Grid>
        </Grid>
    );
}

export default AISTab