import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Paper, Button, useMediaQuery, useTheme, Slide, Fade } from '@mui/material';

const UniteLandingPage = () => {
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
                        UNITE
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
                        プロダクトの理念
                    </Typography>
                    <Typography variant="body1" textAlign="center" maxWidth="600px">
                        "自分らしくいられる環境"をみんなで作る。<br/>
                        一人一人が自分自身で生活の幸福度を高める。<br/>
                        結果として強くなる組織に対して<br/>
                        UNITEは最大限の貢献をいたします。
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
                                    Curios
                                </Typography>
                                <Typography variant="body1">
                                    我々は全ての好奇心には投資的価値があると信じています。<br/>
                                    UNITEは組織のメンバーひとりひとりの"好奇心"の価値を最大化することで、
                                    みんなが自分らしく周囲に価値を創出できる環境を提供します。
                                </Typography>
                                <Typography variant="body2" color={primaryColor} mt={2}>
                                    <li><a href={"/lp/curios"}>CASE1：タグを活用したコンテンツの最適化</a></li>
                                    <li><a href={"/lp/curios"}>CASE2：好奇心が作る小集団</a></li>
                                    <li><a href={"/lp/curios"}>CASE3：組織と個人のベクトルを揃える</a></li>
                                </Typography>
                            </Paper>
                        </Slide>
                    </Grid>

                    {/* ThinkTank Feature */}
                    <Grid item xs={12} sm={4}>
                        <Slide direction="up" in timeout={800}>
                            <Paper elevation={3} sx={{ padding: 4, height: '100%', backgroundColor: accentColor, color: textColor }}>
                                <Typography variant="h5" component="h3" gutterBottom sx={{ color: primaryColor }}>
                                    ThinkTank
                                </Typography>
                                <Typography variant="body1">
                                    技術的な問題から日常の些細なことまで、あらゆる知識を組織全体で共有できます。<br/>
                                    暗黙知を共有し、組織の財産とすることが可能です。物理的な距離を超えたコミュニケーションの活性化が目的です。
                                </Typography>
                                <Typography variant="body2" color={primaryColor} mt={2}>
                                    <li><a href={"/lp/think-tank"}>CASE1：組織のナレッジベースとして活用する</a></li>
                                    <li><a href={"/lp/think-tank"}>CASE2：メンバーに対しての深いインサイト</a></li>
                                    <li><a href={"/lp/think-tank"}>CASE3：コンテンツマーケティングに活用する</a></li>
                                </Typography>
                            </Paper>
                        </Slide>
                    </Grid>

                    {/* AIS Feature */}
                    <Grid item xs={12} sm={4}>
                        <Slide direction="right" in timeout={800}>
                            <Paper elevation={3} sx={{ padding: 4, height: '100%', backgroundColor: accentColor, color: textColor }}>
                                <Typography variant="h5" component="h3" gutterBottom sx={{ color: primaryColor }}>
                                    AIS
                                </Typography>
                                <Typography variant="body1">
                                    AISはあなただけの秘書として、日々の雑務から組織内のデータ分析、戦略立案をはじめとするコンサルタントを担います。<br/>
                                    あなたは自分のビジョンの実現に専念できます。AISは強力な右腕となってあなたをサポートします。
                                </Typography>
                                <Typography variant="body2" color={primaryColor} mt={2}>
                                    <li><a href={"/lp/ais"}>CASE1：ワークフローの自動化</a></li>
                                    <li><a href={"/lp/ais"}>CASE2：勤怠管理・報告を任せる</a></li>
                                    <li><a href={"/lp/ais"}>CASE3：雑談によるメンタルケア</a></li>
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
                        CURIOS
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        paddingBottom={10}
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        - 好奇心による価値創出 -
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        我々は全ての好奇心には投資的価値があると信じています。<br/>
                        UNITEは組織のメンバーひとりひとりの"好奇心"の価値を最大化することで、
                        みんなが自分らしく周囲に価値を創出できる環境を提供します。
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
                        THINK TANK
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        paddingBottom={10}
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        - 組織が有する知識の最高権威 -
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        組織全体で知識を共有し、次世代への引き継ぎがしやすくなります。<br/>
                        何気ないつぶやきから暗黙知を共有し、組織の価値を高めます。
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
                        AIS
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        paddingBottom={10}
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        - あなただけの個人秘書 -
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        textAlign="center"
                        maxWidth={isMobile ? '90%' : '60%'}
                    >
                        雑務を手放し、ビジョン実現に全力を注げる環境を整えます。<br/>
                        AISはあなたのビジネスを強力に支援します。
                    </Typography>
                </Box>
            </Fade>
        </Container>
    );
};

export default UniteLandingPage;
