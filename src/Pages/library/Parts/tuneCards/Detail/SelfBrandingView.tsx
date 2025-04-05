import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Paper, Button, useMediaQuery, useTheme, Slide, Fade } from '@mui/material';
import Profile from "../../../../../models/Profile/Profile";
import {useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import {authenticationState, AuthenticationStateIF} from "../../../../../atoms/AuthenticationState";

const SelfBrandingView = () => {
    const params = useParams();
    const uid = params.uid as string;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [profile, setProfile] = useState(Profile.initProfile);
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);

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

    const setUpProfile = async () => {
        const profileEntity = Profile.initProfile();
        const profileApiResponse = await profileEntity.fetchModel(uid, authState.accessToken);
        profileEntity.setFromAPIResponse(profileApiResponse);
        setProfile(profileEntity);
    }

    useEffect(() => {
        setUpProfile()
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
            {/* Full Screen Section */}
            <Box
                sx={{
                    height: '100vh',
                    backgroundImage: 'url(https://via.placeholder.com/1920x1080)', // Add background image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Fade in timeout={2000}>
                    <Typography
                        variant={isMobile ? 'h4' : 'h2'}
                        component="h1"
                        color="white"
                        textAlign="center"
                        sx={{ fontWeight: 'bold' }}
                    >
                        【モック】{profile.nickName}
                    </Typography>
                </Fade>
            </Box>

            {/* Product Vision Section */}
            <Slide direction="up" in timeout={2000}>
                <Box
                    sx={{
                        paddingY: 10,
                        backgroundColor: accentColor,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h2" gutterBottom>
                        私の理念
                    </Typography>
                    <Typography variant="body1" textAlign="center" maxWidth="600px">
                        {profile.description}<br/>
                    </Typography>
                </Box>
            </Slide>

            {/* Features Section */}
            <Box sx={{ paddingY: 10 }}>
                <Grid container spacing={4} justifyContent="center">
                    {/* Seed Feature */}
                    <Grid item xs={12} sm={4}>
                        <Slide direction="left" in timeout={800}>
                            <Paper elevation={3} sx={{ padding: 4, height: '100%', backgroundColor: accentColor, color: textColor }}>
                                <Typography variant="h5" component="h3" gutterBottom sx={{ color: primaryColor }}>
                                    特徴1
                                </Typography>
                                <Typography variant="body1">
                                    説明
                                </Typography>
                                <Typography variant="body2" color={primaryColor} mt={2}>
                                    <li><a >説明1：説明</a></li>
                                    <li><a >説明2：説明</a></li>
                                    <li><a >説明3：説明</a></li>
                                </Typography>
                            </Paper>
                        </Slide>
                    </Grid>

                    {/* ThinkTank Feature */}
                    <Grid item xs={12} sm={4}>
                        <Slide direction="up" in timeout={800}>
                            <Paper elevation={3} sx={{ padding: 4, height: '100%', backgroundColor: accentColor, color: textColor }}>
                                <Typography variant="h5" component="h3" gutterBottom sx={{ color: primaryColor }}>
                                    特徴2
                                </Typography>
                                <Typography variant="body1">
                                    説明
                                </Typography>
                                <Typography variant="body2" color={primaryColor} mt={2}>
                                    <li><a >説明1：説明</a></li>
                                    <li><a >説明2：説明</a></li>
                                    <li><a >説明3：説明</a></li>
                                </Typography>
                            </Paper>
                        </Slide>
                    </Grid>

                    {/* AIS Feature */}
                    <Grid item xs={12} sm={4}>
                        <Slide direction="right" in timeout={800}>
                            <Paper elevation={3} sx={{ padding: 4, height: '100%', backgroundColor: accentColor, color: textColor }}>
                                <Typography variant="h5" component="h3" gutterBottom sx={{ color: primaryColor }}>
                                    特徴3
                                </Typography>
                                <Typography variant="body1">
                                    説明
                                </Typography>
                                <Typography variant="body2" color={primaryColor} mt={2}>
                                    <li><a >説明1：説明</a></li>
                                    <li><a >説明2：説明</a></li>
                                    <li><a >説明3：説明</a></li>
                                </Typography>
                            </Paper>
                        </Slide>
                    </Grid>
                </Grid>
            </Box>

            {/* SEED Section - Full Width */}
            <Fade in={seedInView} timeout={2000}>
                <Box
                    id="seed-section"
                    sx={{
                        height: '100vh',
                        backgroundImage: 'url(https://via.placeholder.com/1920x1080)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingX: 2,
                    }}
                >
                    <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" color="white" gutterBottom>
                        特徴1
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        paddingBottom={10}
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        - コピー1 -
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        説明１
                    </Typography>
                </Box>
            </Fade>

            {/* THINK TANK Section - Full Width */}
            <Fade in={thinkTankInView} timeout={2000}>
                <Box
                    id="thinktank-section"
                    sx={{
                        height: '100vh',
                        backgroundImage: 'url(https://via.placeholder.com/1920x1080)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingX: 2,
                    }}
                >
                    <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" color="white" gutterBottom>
                        特徴2
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        paddingBottom={10}
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        - コピー2 -
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        説明2
                    </Typography>
                </Box>
            </Fade>

            {/* AIS Section - Full Width */}
            <Fade in={aisInView} timeout={2000}>
                <Box
                    id="ais-section"
                    sx={{
                        height: '100vh',
                        backgroundImage: 'url(https://via.placeholder.com/1920x1080)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingX: 2,
                    }}
                >
                    <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" color="white" gutterBottom>
                        特徴3
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        paddingBottom={10}
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        - コピー3 -
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        説明3
                    </Typography>
                </Box>
            </Fade>
        </Container>
    );
};

export default SelfBrandingView;
