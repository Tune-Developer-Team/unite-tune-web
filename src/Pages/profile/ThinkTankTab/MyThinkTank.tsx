import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {authenticationState, AuthenticationStateIF} from "../../../atoms/AuthenticationState";
import Box from "@mui/material/Box";
import {Outlet} from "react-router-dom";
import {ThinkDraft} from "../../../models/ThinkTank/ThinkiDraft";
import {Think} from "../../../models/ThinkTank/Think";
import {refreshTimelineState} from "../../../atoms/ThinkTimelineState";

const MyThinkTank = () => {
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const [refreshTimeline, setRefreshTimeline] = useRecoilState(refreshTimelineState);

    // フォーム
    const [thinkDraft, setThinkDraft] = useState<ThinkDraft>(ThinkDraft.initThinkDraft);
    const [parentThink, setParentThink] = useState<Think | null>(null);
    const [targetThink, setTargetThink] = useState<Think|null>(null)

    return (
        <Box>
            <Outlet context={{targetThink, setTargetThink, setParentThink, refreshTimeline}}/>
        </Box>
    );
}

export default MyThinkTank;