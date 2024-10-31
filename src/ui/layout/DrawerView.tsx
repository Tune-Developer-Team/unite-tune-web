import React, {useState} from 'react';
import {styled, Theme, CSSObject} from '@mui/material/styles';
import {
    Box,
    Drawer as MuiDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    useMediaQuery
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import logo from '../../uniteLogo.svg';
import {useRecoilState} from "recoil";
import {authenticationState, AuthenticationStateIF} from "../../atoms/AuthenticationState";
import aiIcon from "../../assets/ais.svg";
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import tsubuyakiIcon from "../../assets/ThinkTankIcon.svg";
import {CustomUrl} from "../../models/CustomUrl/CustomUrl";
import ButtomMenu from "./ButtomMenu";
import HeaderUserIconMenu from "./HeaderUserIconMenu";
import Profile from "../../models/Profile/Profile";
import {profileState} from "../../atoms/ProfileState";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 0),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export interface ParentItem {
    label: string;
    icon: React.ReactNode;
    linkPath: string;
    children?: Array<{ label: string; linkPath: string }>;
}

export default function DrawerView() {
    const navigate = useNavigate();
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const [profile] = useRecoilState(profileState);

    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

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

    // カスタムURL
    const [selectedParent, setSelectedParent] = useState<ParentItem>(parentItems[0]);
    const [customUrlList, setCustomUrlList] = useState<CustomUrl[]>([]);

    const handleParentClick = (item: ParentItem) => {
        setSelectedParent(item);
        navigate(item.linkPath);
    };

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{display: 'flex'}}>
            {isMobile ? (
                <Box sx={{flexGrow: 1, padding: 1, width: "100%"}}>
                    <HeaderUserIconMenu/>
                    <ButtomMenu menuItems={parentItems.slice(0, 3)}/>
                </Box>
            ) : (
                <Drawer variant="permanent" open={open}>
                    <HeaderUserIconMenu/>
                    <DrawerHeader>
                        <Button onClick={open ? handleDrawerClose : handleDrawerOpen}>
                            {open ? <ChevronLeftIcon/> : <img src={logo} width={20}/>}
                        </Button>
                    </DrawerHeader>
                    <Divider/>
                    <List>
                        {parentItems.map((item, index) => (
                            <ListItem key={index} disablePadding onClick={() => handleParentClick(item)}>
                                <ListItemButton
                                    sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5}}>
                                    <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} sx={{opacity: open ? 1 : 0}}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        {customUrlList.map((item, index) => (
                            <ListItem key={item.customUrlId} disablePadding sx={{display: 'block'}}>
                                <a href={item.urlString} style={{textDecoration: "none", color: "white"}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <LinkIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={item.textString} sx={{opacity: open ? 1 : 0}}/>
                                    </ListItemButton>
                                </a>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            )}
        </Box>
    );
}
