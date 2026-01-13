import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authenticationState } from '../../atoms/AuthenticationState';
import { profileState } from '../../atoms/ProfileState';
import { parentItemsState } from "../../atoms/ParentItemState";
import { useState } from 'react';
import { DrawerViewModel } from "./DarawerViewModel";
import { CustomUrl } from "../../models/CustomUrl/CustomUrl";
import AddIcon from "@mui/icons-material/Add";
import { AxiosResponse } from "axios";
import Profile from "../../models/Profile/Profile";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    Container,
    Grid,
    TextField, Drawer, useMediaQuery, useTheme
} from '@mui/material';

// Inside your component
const HeaderUserIconMenu = () => {
    //　グローバルオブジェクト
    const [authentication] = useRecoilState(authenticationState);
    const parentItems = useRecoilValue(parentItemsState);
    const [profile] = useRecoilState<Profile>(profileState);

    // ビューモデル
    const [viewModel] = useState<DrawerViewModel>(new DrawerViewModel(authentication));
    const [openPCMenu, setOpenPCMenu] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    // カスタムURL
    const [urlString, setUrlString] = useState<string>('');
    const [customUrlText, setCustomUrlText] = useState<string>('');
    const [customUrlList, setCustomUrlList] = useState<CustomUrl[]>([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const [_, setIsAvatarHovered] = useState(false); // State to track hover

    const handleDrawerOpen = () => {
        setOpenMobileMenu(true);
        document.body.style.overflowY = 'hidden';
    }
    const handleDrawerClose = () => {
        setOpenMobileMenu(false);
        document.body.style.overflowY = '';
    };

    const handleAvatarMouseEnter = () => {
        console.log("hovering");
        setIsAvatarHovered(false); // Set hover state to true
    };

    const handleAvatarMouseLeave = () => {
        setIsAvatarHovered(false); // Reset hover state
    };

    const handleClose = () => {
        setOpenPCMenu(false)
    };

    const userMenu = parentItems.slice(3, 6);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                overflowX: 'auto',
            }}>



            <Tooltip title="Account settings">
                <IconButton
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={openPCMenu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openPCMenu ? 'true' : undefined}
                >
                <Avatar
                    sx={{
                        display: "flex",
                        position: 'fixed', // Changed to fixed
                        top: 10,
                        right: 20,
                        zIndex: 100, // Ensure it stays above other elements
                    }}
                    alt="userIcon"
                    sizes={"ss"}
                    src={profile.iconImage.path??""}
                    onMouseEnter={handleAvatarMouseEnter}
                    onMouseLeave={handleAvatarMouseLeave}
                    onClick={() => {
                        if (!isMobile) {
                            openPCMenu ? setOpenPCMenu(false) : setOpenPCMenu(true)
                            return
                        }

                        if (openMobileMenu) {
                            handleDrawerClose()
                        } else {
                            handleDrawerOpen()
                        }
                    }
                    }
                />
                </IconButton>
            </Tooltip>
            <Menu
                id="account-menu"
                open={openPCMenu}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'relative',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                {userMenu.map((item, index) => (
                    <MenuItem onClick={() => navigate(item.linkPath)}>
                        {item.icon}&nbsp;&nbsp;{item.label}
                    </MenuItem>
                ))}
            </Menu>

            <Box id={"mobile-drawer-menu"} display={openMobileMenu ? "block" : "none"}>
                <Drawer variant="permanent" open={openMobileMenu} anchor={"left"}>
                    <List sx={{
                        gap: 2,
                        overflowX: 'auto',
                        flexWrap: 'flex-wrap',
                    }}>
                        {parentItems.slice(3, 6).map((item, index:number) => (
                            <ListItem key={item.label} disablePadding sx={{display: 'flex'}} onClick={() => {
                                handleDrawerClose()
                                navigate(item.linkPath);
                            }}>
                                <ListItemButton sx={{justifyContent: 'center', px: 2, display: 'block'}}>
                                    <ListItemIcon sx={{minWidth: 0, justifyContent: 'center'}}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <List sx={{
                        gap: 2,
                        overflowX: 'auto',
                        flexWrap: 'flex-wrap'
                    }}>
                        {customUrlList.map((item, index) => (
                            <ListItem key={item.customUrlId} disablePadding sx={{display: 'block'}} onClick={() => {
                                handleDrawerClose();
                                window.location.href = item.urlString;
                            }}>
                                <ListItemButton sx={{justifyContent: 'center', px: 2, display: 'block'}}>
                                    <ListItemIcon sx={{minWidth: 0, justifyContent: 'center'}}/>
                                    <ListItemText primary={item.textString}/>
                                </ListItemButton>
                            </ListItem>
                        ))}

                        <ListItem disablePadding sx={{display: 'block'}} >
                            <ListItemButton sx={{justifyContent: 'center', px: 2, display: 'block'}} onClick={()=>{
                                setIsOpenModal(true);
                            }}>
                                <ListItemIcon sx={{minWidth: 0, justifyContent: 'center'}}><AddIcon/></ListItemIcon>
                                <ListItemText primary={"Custom url"}/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
            </Box>

            {/* Modal for adding a custom URL */}
            <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <Container sx={{backgroundColor: 'black', padding: 4, width: '60%'}}>
                    <Grid container gap={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="text"
                                variant="outlined"
                                onChange={(event) => setCustomUrlText(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="URL"
                                variant="outlined"
                                onChange={(event) => setUrlString(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" gap={2}>
                        <Button
                            variant="outlined"
                            onClick={async () => {
                                await viewModel.addCustomUrl({
                                    uid: authentication.uid,
                                    urlString: urlString,
                                    textString: customUrlText,
                                }).then((response) => {
                                    setCustomUrlList(response.data.customUrlList);
                                }).catch((error: AxiosResponse) => {
                                    console.log(error);
                                });
                                setIsOpenModal(false);
                            }}
                        >
                            Register
                        </Button>
                        <Button onClick={() => setIsOpenModal(false)}>Close</Button>
                    </Grid>
                </Container>
            </Modal>
        </Box>
    );
};

export default HeaderUserIconMenu;
