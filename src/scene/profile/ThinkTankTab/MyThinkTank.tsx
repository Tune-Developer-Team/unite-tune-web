import React, {useState} from "react";
import ThinkTankView, {ThinkTankViewModelIF} from "../../thinkTank/ThinkTankView";
import {MyThinkTankViewModel} from "./MyThinkTankViewModel";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../../atoms/AuthenticationState";
import Box from "@mui/material/Box";

const MyThinkTank = () => {
    const [authState] = useRecoilState(authenticationState);
    const viewModel = MyThinkTankViewModel.appInit();
    return (
        <Box>
            <ThinkTankView viewModel={viewModel.viewInit(authState)}/>
        </Box>
    );
}

export default MyThinkTank;