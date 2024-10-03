import {useState} from 'react';
import {
    Box,
    Button,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    Container,
    Grid,
    TextField, Drawer
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CreateIcon from '@mui/icons-material/Create';
import {DrawerViewModel} from "./DarawerViewModel";
import {CustomUrl} from "../../models/CustomUrl/CustomUrl";
import {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import logo from "../../uniteLogo.svg";
import {profileState} from "../../atoms/ProfileState";
import SettingsIcon from '@mui/icons-material/Settings';
import {authenticationState} from "../../atoms/AuthenticationState";
import LinkIcon from "@mui/icons-material/Link";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import {AvatarIcon} from "../avatarIcon/AvatarIcon";

const TSUBUYAKI_ORIGIN = process.env.REACT_APP_TSUBUYAKI_ORIGIN as string;

const drawerViewModel = new DrawerViewModel();
// Inside your component
const HeaderMenu = () => {
    // ビューモデル
    const [viewModel] = useState<DrawerViewModel>(drawerViewModel);
    const [open, setOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    // カスタムURL
    const [urlString, setUrlString] = useState<string>('');
    const [customUrlText, setCustomUrlText] = useState<string>('');
    const [urlIcon, setUrlIcon] = useState<File | null>(null);
    const [customUrlList, setCustomUrlList] = useState<CustomUrl[]>([]);
    const [authentication] = useRecoilState(authenticationState);

    // const handleDrawerToggle = () => {
    //     setOpen(!open);
    // };
    const navigate = useNavigate();
    const [profile] = useRecoilState(profileState);
    const [isAvatarHovered, setIsAvatarHovered] = useState(false); // State to track hover

    const handleDrawerOpen = () => {
        setOpen(true);
        document.body.style.overflowY = 'hidden';
    }
    const handleDrawerClose = () => {
        setOpen(false);
        document.body.style.overflowY = '';
    };

    const handleAvatarMouseEnter = () => {
        console.log("hovering");
        setIsAvatarHovered(false); // Set hover state to true
    };

    const handleAvatarMouseLeave = () => {
        setIsAvatarHovered(false); // Reset hover state
    };
    const menuItems = [
        {label: 'Profile', icon: <AssignmentIndIcon/>, linkPath: `/user/${authentication.uid}`},
        {
            label: 'SeedEdit',
            icon: <CreateIcon/>,
            linkPath: 'seed/' + viewModel.generateSeedId() + '/edit'
        },
        {
            label: 'Preference',
            icon: <SettingsIcon/>,
            linkPath: "/preference"
        }];

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                overflowX: 'auto',
            }}>
            <Box display={open ? "block" : "none"}>
                <Drawer variant="permanent" open={open} anchor={"left"}>
                    <List sx={{
                        gap: 2,
                        overflowX: 'auto',
                        flexWrap: 'flex-wrap',
                    }}>
                        {menuItems.map((item, index) => (
                            <ListItem key={item.label} disablePadding sx={{display: 'flex'}} onClick={() => {
                                handleDrawerClose()
                                if (item.linkPath === TSUBUYAKI_ORIGIN) {
                                    window.open(item.linkPath, '_blank'); // 仮
                                } else {
                                    navigate(item.linkPath);
                                }
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
            <Box
                sx={{
                    display: "flex",
                    position: 'fixed', // Changed to fixed
                    top: 0,
                    right: 0,
                    zIndex: 10, // Ensure it stays above other elements
                    backgroundColor:"#000000",
                    width: "100%"
                }}
                padding={1}
            >
                <Box width={"100%"}></Box>
                <Avatar
                    alt="userIcon"
                    sizes={"ss"}
                    src={"authentication.iconImage.path"}
                    onMouseEnter={handleAvatarMouseEnter}
                    onMouseLeave={handleAvatarMouseLeave}
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                />
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

export default HeaderMenu;
