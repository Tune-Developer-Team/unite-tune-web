// src/components/Layout.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {useRecoilState, useSetRecoilState} from "recoil";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DrawerView from "./DrawerView";
import CustomTabs from "./CustomTabs";
import { useMediaQuery } from "@mui/material";
import { authenticationState } from "../../atoms/AuthenticationState";
import {ParentItem, parentItemsState} from "../../atoms/ParentItemState";
import HomeIcon from "@mui/icons-material/Home";
import tsubuyakiIcon from "../../assets/ThinkTankIcon.svg";
import aiIcon from "../../assets/ais.svg";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SettingsIcon from "@mui/icons-material/Settings";
import {useEffect} from "react";

const Layout = () => {
    const [authentication] = useRecoilState(authenticationState);
    const navigate = useNavigate();
    const setParentItemState = useSetRecoilState(parentItemsState);

    const isLogin = authentication.uid.length > 0;
    const pathname = useLocation().pathname;
    if (!isLogin && pathname !== '/signin') {
        navigate("/signin");
    }

    const isMobile = useMediaQuery('(max-width:600px)');

    const parentItems:ParentItem[] = [
        {
            label: 'Home',
            icon: <HomeIcon />,
            linkPath: "/",
            children: [
                { label: 'All', linkPath: "/home" },
                { label: 'Quest', linkPath: "/quests" },
                { label: 'Blog', linkPath: "/blog" },
                { label: 'Library', linkPath: "/library" },
            ],
            isActive: false
        },
        {
            label: 'Think Tank',
            icon: <img src={tsubuyakiIcon} alt={""} />,
            linkPath: "/think-tank",
            children: [
                { label: 'All', linkPath: "/think-tank" },
                { label: 'General', linkPath: "/think-tank?filter=info,notify" },
                { label: 'Tech', linkPath: "/think-tank?filter=tec,技術" },
            ],
            isActive: pathname.startsWith("/think-tank")
        },
        {
            label: 'AIS',
            icon: <img src={aiIcon} alt={""} />,
            linkPath: `/ais`,
            children: [{ label: '勤怠', linkPath: '/ais' }],
            isActive: pathname.startsWith("/ais")
        },
        {
            label: 'Quests',
            icon: <AssignmentIndIcon />,
            linkPath: "/quests",
            children: [
                { label: 'All', linkPath: "/quests" },
                { label: 'open', linkPath: "/quests?filter=open" },
                { label: 'close', linkPath: "/quests?filter=close" },
            ],
            isActive: pathname.startsWith("/quests")
        },
        {
            label: 'Profile',
            icon: <AssignmentIndIcon />,
            linkPath: `/user/${authentication.uid}`,
            children: [
                { label: 'Bio', linkPath: `/user/${authentication.uid}` },
                { label: 'ThinkTank', linkPath: `/user/${authentication.uid}/think-tank` },
                { label: 'Library', linkPath: `/user/${authentication.uid}/library` },
                { label: 'Blog', linkPath: `/user/${authentication.uid}/blog` },
                { label: 'Ais', linkPath: `/user/${authentication.uid}/ais` }
            ],
            isActive: pathname.startsWith(`/user/${authentication.uid}`)
        },
        {
            label: 'Preference',
            icon: <SettingsIcon />,
            linkPath: "/preference",
            children: [{ label: 'Settings', linkPath: '/preference/' }],
            isActive: pathname.startsWith(`/preference`)
        },
    ];

    console.log("=========================================");
    console.log("active ParentItems:")
    console.log(parentItems.find(item => item.isActive));
    console.log("=========================================");

    useEffect(() => {
        console.log("Layout setUp")
        setParentItemState(parentItems);
    });

    useEffect(() => {
        console.log("Update Tab");

        // 現在の URL に基づいて isActive を更新
        let newParentItemState = parentItems.map((item) => ({
            ...item,
            isActive: item.label === "Home"
                ? pathname === item.linkPath // "Home" の場合は完全一致
                : pathname.startsWith(item.linkPath), // それ以外は部分一致
        }));

        // 全ての isActive が false の場合、label が "Home" の要素を isActive: true にする
        if (newParentItemState.every(item => !item.isActive)) {
            newParentItemState = newParentItemState.map(item => ({
                ...item,
                isActive: item.label === "Home", // "Home" の場合に true、それ以外は false
            }));
        }

        // 状態を更新
        setParentItemState(newParentItemState);

        console.log("Updated pathname:", pathname);
    }); // location が変更されたときに実行


    return (
        <>
            <CssBaseline />
            <DrawerView />
            <Box sx={{ padding: isMobile ? 2 : 12 }}>
                <Box width={"100%"} sx={{ backgroundColor: "#ff0000" }}>
                    <CustomTabs/>
                </Box>
                <Box sx={{ paddingTop: isMobile ? 3 : 0 }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}

export default Layout;
