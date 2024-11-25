import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Paper, Button, useMediaQuery, useTheme, Slide, Fade } from '@mui/material';
import {Outlet} from "react-router-dom";

const UniteLandingPageHeader = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Viewport detection for triggering Fade animation
    const [seedInView, setSeedInView] = useState(false);
    const [thinkTankInView, setThinkTankInView] = useState(false);
    const [aisInView, setAisInView] = useState(false);

    const handleScroll = () => {
        const seedSection = document.getElementById('seed-section');
        const thinkTankSection = document.getElementById('thinktank-section');
        const aisSection = document.getElementById('ais-section');

        if (seedSection && thinkTankSection && aisSection) {
            const seedTop = seedSection.getBoundingClientRect().top;
            const thinkTankTop = thinkTankSection.getBoundingClientRect().top;
            const aisTop = aisSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (seedTop <= windowHeight * 0.8) setSeedInView(true);
            if (thinkTankTop <= windowHeight * 0.8) setThinkTankInView(true);
            if (aisTop <= windowHeight * 0.8) setAisInView(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Define colors for dark mode
    const primaryColor = '#00ADB5'; // Aqua accent
    const backgroundColor = '#000000'; // Dark background
    const textColor = '#EEEEEE'; // Light text color
    const accentColor = '#393E46'; // Darker accent

    return (
        <Container maxWidth={false} sx={{ padding: 0, backgroundColor: backgroundColor, color: textColor }}>
            <Typography>
                ヘッダーエリア
            </Typography>
            <Outlet/>
        </Container>
    );
};

export default UniteLandingPageHeader;
