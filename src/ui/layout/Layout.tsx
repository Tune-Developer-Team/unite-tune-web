import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {useRecoilState, useSetRecoilState} from "recoil";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import DrawerView from "./DrawerView";
import CustomTabs from "./CustomTabs";
import {Button, useMediaQuery} from "@mui/material";
import {authenticationState} from "../../atoms/AuthenticationState";
import {ParentItem, parentItemsState} from "../../atoms/ParentItemState";
import tsubuyakiIcon from "../../assets/ThinkTankIcon.svg";
import aiIcon from "../../assets/ais.svg";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SettingsIcon from "@mui/icons-material/Settings";
import {useEffect} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from '@mui/icons-material/Home';

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

    const defaultPage = "Library";
    const parentItems: ParentItem[] = [
        {
            label: 'Library',
            icon: <HomeIcon/>,
            linkPath: "/",
            children: [
                {label: 'All', linkPath: "/library"},
                {label: 'DBog', linkPath: "/library/d-blog-list"},
                {label: 'Clips', linkPath: "/library/clip-list"},
                {label: 'Cards', linkPath: "/library/card-list"},
                {label: 'Quests', linkPath: "/library/quest-list"},
                {label: 'Books', linkPath: "/library/book-list"},
                {label: 'Documents', linkPath: "/library/document-list"},
            ],
            isActive: false
        },
        {
            label: 'Think Tank',
            icon: <img src={tsubuyakiIcon} alt={""}/>,
            linkPath: "/think-tank",
            children: [
                {label: 'All', linkPath: "/think-tank"},
                {label: 'General', linkPath: "/think-tank?filter=info,notify"},
                {label: 'Tech', linkPath: "/think-tank?filter=tec,技術"},
            ],
            isActive: pathname.startsWith("/think-tank")
        },
        {
            label: 'AIS',
            icon: <img src={aiIcon} alt={""}/>,
            linkPath: `/ais/${authentication.uid}`,
            children: [
                {label: '勤怠', linkPath: `/ais/${authentication.uid}/kintai`},
                {label: '雑談', linkPath: `/ais/${authentication.uid}/zatsudan`}
            ],
            isActive: pathname.startsWith("/ais")
        },
        {
            label: 'Profile',
            icon: <AssignmentIndIcon/>,
            linkPath: `/user/${authentication.uid}`,
            children: [
                {label: 'Bio', linkPath: `/user/${authentication.uid}`},
                {label: 'ThinkTank', linkPath: `/user/${authentication.uid}/think-tank`},
                {label: 'Library', linkPath: `/user/${authentication.uid}/library`},
                {label: 'Ais', linkPath: `/user/${authentication.uid}/ais`}
            ],
            isActive: pathname.startsWith(`/user/${authentication.uid}`)
        },
        {
            label: 'Preference',
            icon: <SettingsIcon/>,
            linkPath: "/preference",
            children: [{label: 'Settings', linkPath: '/preference/'}],
            isActive: pathname.startsWith(`/preference`)
        }
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
            isActive: item.label === defaultPage
                ? pathname === item.linkPath // デフォルトページの場合は完全一致
                : pathname.startsWith(item.linkPath), // それ以外は部分一致
        }));

        // 全ての isActive が false の場合、label が "Library" の要素を isActive: true にする
        if (newParentItemState.every(item => !item.isActive)) {
            newParentItemState = newParentItemState.map(item => ({
                ...item,
                isActive: item.label === defaultPage, // デフォルトページの場合に true、それ以外は false
            }));
        }

        // 状態を更新
        setParentItemState(newParentItemState);

        // ブラウザのタブのtitleを更新
        const currentPage = newParentItemState.filter(item => item.isActive)[0].label;
        document.title = `Unite-${currentPage}`;

        console.log("Updated pathname:", pathname);
    }); // location が変更されたときに実行

    return (
        <>
            <CssBaseline/>
            <Box sx={{paddingTop: isMobile ? 0 : 12, paddingLeft: isMobile ? 2 : 8}}>
                <Box width={"100%"}
                     sx={{
                         backgroundColor: "#121212",
                         position: 'fixed',
                         top: 0,
                         zIndex: 50,
                         paddingTop: 4,
                         display: 'flex',
                         overflowX: 'auto',
                         scrollbarWidth: 'none', // Firefox用
                         '&::-webkit-scrollbar': {
                             display: 'none', // Chrome, Safari用
                         },
                     }}>
                    <CustomTabs/>
                    <Box paddingTop={2}>
                        <Button
                            startIcon={<ArrowBackIcon/>}
                            onClick={() => navigate(-1)} // Go back to the previous screen
                            sx={{
                                marginBottom: 2,
                                color: 'white', // ボタンのテキストカラーを白に設定
                                '&:hover': {
                                    color: 'rgba(220,220,220,0.68)', // ボタンのテキストカラーを白に設定
                                },
                            }}
                        >
                        </Button>
                        <Button
                            startIcon={<ArrowForwardIcon/>}
                            onClick={() => navigate(+1)} // Go back to the previous screen
                            sx={{
                                marginBottom: 2,
                                color: 'white', // ボタンのテキストカラーを白に設定
                                '&:hover': {
                                    color: 'rgba(220,220,220,0.68)', // ボタンのテキストカラーを白に設定
                                },
                            }}
                        >
                        </Button>
                    </Box>
                </Box>
                <Box sx={{paddingTop: isMobile ? 14 : 0, paddingLeft: 2, paddingRight: 2}}>
                    <Outlet/>
                </Box>
            </Box>
            <DrawerView/>
        </>
    );
}

export default Layout;
