import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import {authenticationState} from "../../atoms/AuthenticationState";
import {useRecoilState, useRecoilValue} from "recoil";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import aiIcon from "../../assets/ais.svg";
import tsubuyakiIcon from "../../assets/ThinkTankIcon.svg";
import Profile from "../../models/Profile/Profile";
import DrawerView, {ParentItem} from "./DrawerView";
import CustomTabs from "./CustomTabs";
import {useMediaQuery} from "@mui/material";

export default function Layout() {
    const navigate = useNavigate();
    const [authentication] = useRecoilState(authenticationState);
    const [authState] = useRecoilState(authenticationState);
    const parentItems: ParentItem[] = [
        {
            label: 'Home',
            icon: <HomeIcon/>,
            linkPath: "/",
            children: [
                {label: 'Overview', linkPath: "/home/overview"},
            ],
        },
        {
            label: 'Think Tank',
            icon: <img src={tsubuyakiIcon} alt={""}/>,
            linkPath: "/think-tank",
            children: [
                {label: 'All', linkPath: "/"},
                {label: 'General', linkPath: "/"},
                {label: 'Tech', linkPath: "/"},
            ]
        },
        {
            label: 'AIS',
            icon: <img src={aiIcon} alt={""}/>,
            linkPath: `/ais/${authState.uid}`,
            children: [
                {label: '勤怠', linkPath: '/'}
            ]
        },
        {
            label: 'Quests',
            icon: <AssignmentIndIcon/>,
            linkPath: "/quests",
            children: [
                {label: 'All', linkPath: "/"},
                {label: '募集中', linkPath: "/"},
                {label: '終了済み', linkPath: "/"},
            ]
        },
        {
            label: 'Blog',
            icon: <AssignmentIndIcon/>,
            linkPath: "/blogposts",
            children: [
                {label: 'Blog Posts', linkPath: `/`}
            ]
        },
        {
            label: 'Preference',
            icon: <SettingsIcon/>,
            linkPath: "/preference",
            children: [
                {label: 'Settings', linkPath: '/preference/'}
            ]
        },
        {
            label: 'Profile',
            icon: <AssignmentIndIcon/>,
            linkPath: `/user/${authState.uid}`,
            children: [
                {label: 'Main', linkPath: `/user/${authState.uid}`},
                {label: 'Think Tank', linkPath: `/user/${authState.uid}/think-tank`},
                {label: 'Library', linkPath: `/user/${authState.uid}/library`},
                {label: 'AIS', linkPath: `/user/${authState.uid}/ais`},
                {label: 'Portfolio', linkPath: `/user/${authState.uid}/portfolio`},
            ],
        },
    ];
    const [selectedParent, setSelectedParent] = useState<ParentItem>(parentItems[1]);

    // ログイン前の場合は遷移する
    const isLogin: boolean = authentication.uid.length > 0;
    const pathname = useLocation().pathname;
    if (!isLogin && (pathname !== '/signin')) {
        navigate("/signin");
    }

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <>
            <CssBaseline/>
            <DrawerView/>
            <Box sx={{padding: isMobile ? 2 : 12}}>
                <Box width={"100%"} sx={{backgroundColor: "#ff0000"}}>
                    {selectedParent?.children && (
                        <CustomTabs items={selectedParent.children}/>
                    )}
                </Box>
                <Box sx={{paddingTop: isMobile ? 3 : 0}}>
                    <Outlet/>
                </Box>
            </Box>
        </>
    );
}