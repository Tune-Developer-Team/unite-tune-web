import React, { useState } from 'react';
import {
    Box, Drawer as MuiDrawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Button, useMediaQuery
} from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRecoilState } from 'recoil';
import { parentItemsState, ParentItem } from "../../atoms/ParentItemState";
import logo from '../../uniteLogo.svg';
import HeaderUserIconMenu from "./HeaderUserIconMenu";
import BottomMenu from "./ButtomMenu";
import { CustomUrl } from "../../models/CustomUrl/CustomUrl";

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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 0),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
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

export default function DrawerView() {
    const navigate = useNavigate();
    const [parentItems] = useRecoilState<ParentItem[]>(parentItemsState);
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const [customUrlList] = useState<CustomUrl[]>([]);
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleItemClick = (item: ParentItem) => {
        navigate(item.linkPath);
    };

    const sideAppList = parentItems.slice(0,3);

    return (
        <Box sx={{ display: 'flex' , zIndex:100 }}>
            {isMobile ? (
                <Box sx={{ flexGrow: 1, padding: 1, width: "100%" }}>
                    <HeaderUserIconMenu />
                    <BottomMenu />
                </Box>
            ) : (
                <Drawer id={"pc-drawer-menu"} variant="permanent" open={open}>
                    <HeaderUserIconMenu />
                    <DrawerHeader>
                        <Button onClick={open ? handleDrawerClose : handleDrawerOpen}>
                            {open ? <ChevronLeftIcon /> : <img src={logo} width={20} />}
                        </Button>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {sideAppList.map((item, index) => (
                            <ListItem key={index} disablePadding onClick={() => handleItemClick(item)}>
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
                    <Divider />
                    <List>
                        {customUrlList.map((item) => (
                            <ListItem key={item.customUrlId} disablePadding sx={{ display: 'block' }}>
                                <a href={item.urlString} style={{ textDecoration: "none", color: "white" }}>
                                </a>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            )}
        </Box>
    );
}
