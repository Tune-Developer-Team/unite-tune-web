import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {SelectedTabIF, selectedTabState} from "../../../atoms/SelectedTabState";
import threeDModel from "./crappy.png";

const LibraryTab = () => {
    // グローバルオブジェクト
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

    return (
        <Grid container spacing={2} className={"Goods"}>
            <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"tab"}>
                🚧開発中🚧<br/>Blog,Clip,Book,Document
            </Grid>
            <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} className={"table"}>
                自分が出したコンテンツが表示される
            </Grid>
        </Grid>
    );
}

export default LibraryTab