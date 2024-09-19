import * as React from 'react';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Container, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, TextField} from "@mui/material";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CreateIcon from '@mui/icons-material/Create';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import {authenticationState} from "../../atoms/AuthenticationState";
import AddIcon from '@mui/icons-material/Add';

import {useRecoilState} from "recoil";
import {useLocation, useNavigate} from "react-router-dom";
import {DrawerViewModel} from "./DarawerViewModel";
import {useEffect, useState} from "react";
import {profileState} from "../../atoms/ProfileState";
import Button from "@mui/material/Button";
import {navigationState} from "../../atoms/NavigationState";
import LinkIcon from '@mui/icons-material/Link';

import logo from "../../logo.png";
import {CustomUrl} from "../../models/CustomUrl/CustomUrl";
import {AxiosResponse} from "axios";
import aiIcon from"../../assets/ais.svg";
import tsubuyakiIcon from"../../assets/tsubuyakiIcon.svg";

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
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
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
export default function DrawerView() {
    const navigate = useNavigate();

    // ビューモデル
    const [viewModel] = useState<DrawerViewModel>(drawerViewModel);

    const [navigation] = useRecoilState(navigationState);
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

        return () => {
            // クリーンアップ
            viewModel.cleanUp();
        };
    }, []);

    // ログイン前の場合は遷移する
    const isLogin: boolean = authentication.uid.length > 0;
    const pathname = useLocation().pathname;
    if (!isLogin && (navigation.isEnableRedirect) && (pathname !== '/signin' )) {
        window.location.href = '/signin';
    }

    return (
        <Box sx={{display: navigation.isHidden ? 'none' : 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Button style={{color:"#fff"}} onClick={open ? handleDrawerClose : handleDrawerOpen}>
                        {open ? <span> <img src={logo} width={100} style={{marginRight: 40}}/> <ChevronLeftIcon/> </span> : <ChevronRightIcon/>}
                    </Button>
                </DrawerHeader>
                <Divider/>
                <List>
                    {[
                        {label: 'home', icon: <HomeIcon/>, linkPath: "/"},
                        {label: 'Profile', icon: <AssignmentIndIcon/>, linkPath: `/user/${authentication.uid}`},
                        {label: 'SeedEdit', icon: <CreateIcon/>, linkPath: 'seed/' + viewModel.generateSeedId() + '/edit'},
                        {label: 'Tsubuyaki', icon: <img src={tsubuyakiIcon}/>, linkPath: TSUBUYAKI_ORIGIN},
                    ].map((item, index) => (
                        <ListItem key={item.label} disablePadding sx={{display: 'block'}} onClick={()=>{

                            if(item.linkPath == TSUBUYAKI_ORIGIN){
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
                        {label: 'AIS', icon: <img src={aiIcon}/>, linkPath:  `/user/${authentication.uid}/ais`},
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
                        {/*<Grid sx={{paddingTop: 3, paddingRight: 3}}>*/}
                        {/*    <Button*/}
                        {/*        component="label"*/}
                        {/*        role={undefined}*/}
                        {/*        variant="outlined"*/}
                        {/*        tabIndex={-1}*/}
                        {/*        startIcon={<FileUpload/>}*/}
                        {/*        onChange={(event) => {*/}
                        {/*            if (event.target instanceof HTMLInputElement) {*/}
                        {/*                console.log(event.target.files);*/}
                        {/*                if (event.target.files !== null) {*/}
                        {/*                    setUrlIcon(event.target.files[0]);*/}
                        {/*                }*/}
                        {/*            } else {*/}
                        {/*                console.log('none');*/}
                        {/*            }*/}
                        {/*        }}>*/}
                        {/*        <VisuallyHiddenInput type="file"/>*/}
                        {/*    </Button>*/}
                        {/*</Grid>*/}
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
                        <Grid sx={{width: "100%", alignContent:"center" ,textAlign: "center"}} gap={5}>
                            <Grid sx={{display: "inline-block", paddingRight: 1}}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="outlined"
                                    onClick={ async () => {
                                        await viewModel.addCustomUrl({uid: authentication.uid, urlString: urlString, textString: customUrlText}).then((response) => {
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
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
            </Box>
        </Box>
    );
}