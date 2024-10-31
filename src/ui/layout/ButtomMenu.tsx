import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    Typography
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authenticationState } from "../../atoms/AuthenticationState";

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    linkPath: string;
}

interface FooterMenuProps {
    menuItems: MenuItem[];
}

const BottomMenu: React.FC<FooterMenuProps> = ({ menuItems }) => {
    const navigate = useNavigate();

    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [lastScrollY, setLastScrollY] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => {
            const currentHeight = window.innerHeight;
            if (currentHeight < viewportHeight) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
                setViewportHeight(currentHeight);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        setViewportHeight(window.innerHeight);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [viewportHeight, lastScrollY]);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                backgroundColor: '#000000',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
        >
            <List sx={{
                display: 'flex',
                overflowX: 'auto',
                width: "100%"
            }}>
                {menuItems.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ justifyContent: "center" }} onClick={() => {
                        navigate(item.linkPath);
                    }}>
                        <Box display={"block"} textAlign={"center"}>
                            {item.icon}
                            <Typography>
                                {item.label}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default BottomMenu;
