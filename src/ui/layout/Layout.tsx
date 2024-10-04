import * as React from 'react';
import {styled, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Container, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, TextField} from "@mui/material";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CreateIcon from '@mui/icons-material/Create';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import {authenticationState} from "../../atoms/AuthenticationState";
import AddIcon from '@mui/icons-material/Add';

import {useRecoilState} from "recoil";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {DrawerViewModel} from "./DarawerViewModel";
import {useEffect, useState} from "react";
import {profileState} from "../../atoms/ProfileState";
import Button from "@mui/material/Button";
import LinkIcon from '@mui/icons-material/Link';

import logo from "../../uniteLogo.svg";
import {CustomUrl} from "../../models/CustomUrl/CustomUrl";
import {AxiosResponse} from "axios";
import aiIcon from "../../assets/ais.svg";
import tsubuyakiIcon from "../../assets/tsubuyakiIcon.svg";
import HeaderMenu from "./HeaderMenu";
import FooterMenu from "./FooterMenu";

const drawerWidth = 240;
const TSUBUYAKI_ORIGIN = process.env.REACT_APP_TSUBUYAKI_ORIGIN as string;

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
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
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

const drawerViewModel = new DrawerViewModel();
export default function Layout() {
    const navigate = useNavigate();

    // ビューモデル
    const [viewModel] = useState<DrawerViewModel>(drawerViewModel);

    const [authentication] = useRecoilState(authenticationState);
    const [profile] = useRecoilState(profileState);

    // カスタムURL
    const [urlString, setUrlString] = useState<string>('');
    const [customUrlText, setCustomUrlText] = useState<string>('');
    const [urlIcon, setUrlIcon] = useState<File | null>(null);
    const [customUrlList, setCustomUrlList] = useState<CustomUrl[]>([]);

    // ドロワー制御
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        // セットアップ
        viewModel.setUp({
            authentication: {
                accessToken: authentication.accessToken,
                uid: authentication.uid,
                email: authentication.email
            },
            profile: {
                nickName: profile.nickName,
                iconImage: profile.iconImage
            }
        });

        void viewModel.fetchCustomUrl().then((response) => {
            console.log(response);
            setCustomUrlList(response.data.customUrlList)
        }).catch((error: AxiosResponse) => {
            console.log(error);
        });

        navigate("/home");

        return () => {
            // クリーンアップ
            viewModel.cleanUp();
        };
    }, []);

    // ログイン前の場合は遷移する
    const isLogin: boolean = authentication.uid.length > 0;
    const pathname = useLocation().pathname;
    if (!isLogin && (pathname !== '/signin')) {
        window.location.href = '/signin';
    }

    return (
        <Box>
            <CssBaseline/>
            <Box sx={{display: {xs: "none", sm: "none", md: "block", lg: "block"}}}>
                <Drawer variant="permanent" open={open} anchor={"left"}>
                    <DrawerHeader>
                        <Button style={{color: "#fff"}} onClick={open ? handleDrawerClose : handleDrawerOpen}>
                            {open ? <span> <ChevronLeftIcon/> <img src={logo} width={20}/> </span> :
                                <img src={logo} width={20} style={{marginLeft: 10}}/>}
                        </Button>
                    </DrawerHeader>
                    <Divider/>
                    <List>
                        {[
                            {label: 'home', icon: <HomeIcon/>, linkPath: "/"},
                            {label: 'Profile', icon: <AssignmentIndIcon/>, linkPath: `/user/${authentication.uid}`},
                            {
                                label: 'SeedEdit',
                                icon: <CreateIcon/>,
                                linkPath: 'seed/' + viewModel.generateSeedId() + '/edit'
                            },
                            {label: 'Tsubuyaki', icon: <img src={tsubuyakiIcon}/>, linkPath: TSUBUYAKI_ORIGIN},
                        ].map((item, index) => (
                            <ListItem key={item.label} disablePadding sx={{display: 'block'}} onClick={() => {

                                if (item.linkPath == TSUBUYAKI_ORIGIN) {
                                    window.open(item.linkPath, '_blank') // TODO: 仮
                                }

                                navigate(item.linkPath);
                            }}>
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
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} sx={{opacity: open ? 1 : 0}}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        {[
                            {label: 'AIS', icon: <img src={aiIcon}/>, linkPath: `/user/${authentication.uid}/ais`},
                            {label: 'Preference', icon: <SettingsIcon/>, linkPath: "/preference"},
                        ].map((item, index) => (
                            <ListItem key={item.label} disablePadding sx={{display: 'block'}} onClick={() => {
                                navigate(item.linkPath)
                            }}>
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
                        <Box sx={{display: "flex"}}>
                            <ListItemButton onClick={() => {
                                setIsOpenModal(true);
                            }}>
                                <AddIcon/>
                                <Typography sx={{paddingLeft: "2rem"}}>
                                    ADD CUSTOM URL
                                </Typography>
                            </ListItemButton>
                        </Box>
                    </List>
                </Drawer>
                <Modal
                    open={isOpenModal}
                    onClose={() => {
                        setIsOpenModal(false);
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    BackdropProps={{
                        onClick: (event) => event.stopPropagation(),
                    }}
                >
                    <Container sx={{display: "block", backgroundColor: "black", marginTop: 30, width: "60%"}}>
                        <Grid sx={{display: "flex", padding: 2}} gap={2}>
                            <Grid sx={{width: 1000}}>
                                <TextField
                                    fullWidth
                                    label="text"
                                    variant="outlined"
                                    sx={{mt: 2}}
                                    onChange={(event) => {
                                        setCustomUrlText(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid sx={{width: 1000}}>
                                <TextField
                                    fullWidth
                                    label="URL"
                                    variant="outlined"
                                    sx={{mt: 2}}
                                    onChange={(event) => {
                                        setUrlString(event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid sx={{width: "100%", alignContent: "center", textAlign: "center"}} gap={5}>
                            <Grid sx={{display: "inline-block", paddingRight: 1}}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="outlined"
                                    onClick={async () => {
                                        await viewModel.addCustomUrl({
                                            uid: authentication.uid,
                                            urlString: urlString,
                                            textString: customUrlText
                                        }).then((response) => {
                                            setCustomUrlList(response.data.customUrlList)
                                        }).catch((error: AxiosResponse) => {
                                            console.log(error);
                                        });
                                        setIsOpenModal(false);
                                    }}>
                                    Register
                                </Button>
                            </Grid>
                            <Grid sx={{display: "inline-block", paddingLeft: 1}}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    onClick={() => {
                                        setIsOpenModal(false);
                                    }}>
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Modal>
                <Box paddingTop={2}/>
                <Box paddingLeft={10}>
                    <Outlet/>
                </Box>
                <Box textAlign={"center"} paddingTop={6} paddingBottom={12}>
                    <Typography fontSize={"small"}>
                        Ver.{process.env.REACT_APP_VERSION as string}&nbsp;&nbsp;
                        powered by Tune&nbsp;©︎</Typography>
                </Box>
            </Box>
            <Box sx={{display: {xs: "block", sm: "block", md: "none", lg: "none"}}}>
                <HeaderMenu/>
                <Box paddingLeft={2} paddingRight={2} paddingTop={10}>
                    <Outlet/>
                    <Box textAlign={"center"}  paddingTop={6} paddingBottom={12}>
                        <Typography fontSize={"small"}>
                            Ver.{process.env.REACT_APP_VERSION as string}&nbsp;&nbsp;
                            powered by Tune&nbsp;©︎</Typography>
                    </Box>
                </Box>
                <FooterMenu/>
            </Box>
        </Box>
    );
}