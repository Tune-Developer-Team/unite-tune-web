import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import aiIcon from "../../assets/ais.svg";
import tsubuyakiIcon from "../../assets/ThinkTankIcon.svg";
import { authenticationState } from "../../atoms/AuthenticationState";

const FooterMenu = () => {
    const [authentication] = useRecoilState(authenticationState);
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
                // 下にスクロールした場合は非表示に
                setIsVisible(false);
            } else {
                // 上にスクロールした場合はすぐに表示
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
                overflowX: 'auto',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                pointerEvents: isVisible ? 'auto' : 'none', // コンポーネントが非表示の時はクリックを無効化
            }}
        >
            <List sx={{
                display: 'flex',
                overflowX: 'auto',
                width: "100%"
            }}>
                {[
                    { label: 'Home', icon: <HomeIcon />, linkPath: "/home" },
                    { label: 'ThinkTank', icon: <img src={tsubuyakiIcon} alt="ThinkTank Icon" />, linkPath: `/timeLine/` },
                    { label: 'AIS', icon: <img src={aiIcon} alt="AIS Icon" />, linkPath: `/user/${authentication.uid}/ais` }
                ].map((item) => (
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

export default FooterMenu;
