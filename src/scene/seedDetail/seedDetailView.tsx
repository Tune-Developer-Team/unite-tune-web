import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useNavigate, useParams} from "react-router-dom";
import {SeedDetailViewModel} from "./seedDetailViewModel";
import {useRecoilState} from "recoil";
import {navigationState} from "../../atoms/NavigationState";
import {authenticationState} from "../../atoms/AuthenticationState";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";
import RoundedButton from "../../ui/button/RoundedButton";
import {AvatarIcon} from "../../ui/avatarIcon/AvatarIcon";
import ScrollContainer from "../../ui/container/ScrollContainer";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const seedDetailViewModel = new SeedDetailViewModel();

const SeedDetailView = () => {
    const [viewModel, setViewModel] = useState<SeedDetailViewModel>(seedDetailViewModel);
    const [seedDetail, setSeedDetail] = useState<SeedDetail>(viewModel.seedDetail);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [isShowAllDescription, setIsShowAllDescription] = useState<boolean>(false);
    const [isShowAllMember, setIsShowAllMember] = useState<boolean>(false);

    const navigate = useNavigate();

    const params = useParams();
    const seedId = params.seedId as string;

    const [isAvatarHovered, setIsAvatarHovered] = useState(false); // State to track hover

    const handleAvatarMouseEnter = () => {
        console.log("hovering");
        setIsAvatarHovered(true); // Set hover state to true
    };

    const handleAvatarMouseLeave = () => {
        setIsAvatarHovered(false); // Reset hover state
    };

    const setUp = async (): Promise<void> => {
        const newViewModel = await viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, seedId: seedId,
        });
        setSeedDetail(viewModel.seedDetail);
    }

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
        // セットアップ
        void setUp();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    console.log(seedDetail.imagePathList)

    return (
        <Box className="SeedDetail">
            <Box className={"SeedCover"}>
                {/*pc*/}
                <Box paddingBottom={2} sx={{display: {xs:"none",s:"none",md:"block", lg: "block", xl: "block"}}}>
                    <img src={seedDetail.imagePathList[0]?.path ?? ""}
                         alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                         style={{objectFit:"cover"}}
                         width={370}
                         height={370}
                    />
                </Box>
                {/*phone*/}
                <Box paddingBottom={2} sx={{display: {xs:"block",s:"block",md:"none", lg: "none", xl: "none"}}}>
                    <img src={seedDetail.imagePathList[0]?.path ?? ""}
                         alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                         style={{objectFit:"cover"}}
                         width={350}
                         height={350}
                    />
                </Box>
                <Box textAlign={"end"} width={"100%"} marginTop={-37}
                     display={seedDetail.ownerUserUid === authState.uid ? "block" : "none"}>
                    <MoreHorizIcon onClick={() => {
                        navigate(`/seed/${seedId}/edit`);
                    }}/>
                </Box>
            </Box>

            <Grid container spacing={2} paddingTop={25} className={"SeedDetailMainContent"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12} sx={{backgroundColor:"rgba(12,12,12,0.79)"}}>
                    <Typography variant="h6" component="div" sx={{ textAlign: "start" }}>
                        {seedDetail.title}
                    </Typography>
                </Grid>

                <Grid xs={4} sm={4} md={4} lg={4} textAlign={"center"}>
                    <Box width={"100%"} >
                        star
                    </Box>
                    <Box width={"100%"} >
                        ⭐️⭐️⭐️⭐️
                    </Box>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4} textAlign={"center"}>
                    <Box width={"100%"}>
                        member
                    </Box>
                    <Box width={"100%"} onClick={() => {
                        setIsShowAllMember(!isShowAllMember)
                    }}>
                        {"6"}
                    </Box>
                </Grid>

                <Grid xs={4} sm={4} md={4} lg={4}>
                    <RoundedButton onClick={()=>{
                    }}>Follow</RoundedButton>
                </Grid>

                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box width={"100%"} fontSize={"0.7rem"} paddingBottom={2} display={isShowAllMember? "none" : "block"}>
                        {seedDetail.seedId}
                    </Box>
                    <Box width={"100%"} paddingBottom={2} display={isShowAllMember? "block" : "none"}>
                        <ScrollContainer>
                            <Box textAlign={"start"} position={"relative"}>
                                <AvatarIcon
                                    alt="userIcon"
                                    sizes={"ss"}
                                    src={"pathName"}
                                    isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                                    onMouseEnter={handleAvatarMouseEnter}
                                    onMouseLeave={handleAvatarMouseLeave}
                                    onClick={() => {
                                        setIsAvatarHovered(true);
                                        navigate(`/user/${seedDetail.ownerUserUid}`);
                                    }}
                                />
                                <span style={{fontSize: "0.7rem"}}>
                                    {seedDetail.ownerUserName}
                                </span>
                            </Box>
                            <Box textAlign={"start"} position={"relative"}>
                                <AvatarIcon
                                    alt="userIcon"
                                    sizes={"ss"}
                                    src={"pathName"}
                                    isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                                    onMouseEnter={handleAvatarMouseEnter}
                                    onMouseLeave={handleAvatarMouseLeave}
                                    onClick={() => {
                                        setIsAvatarHovered(true);
                                        navigate(`/user/${seedDetail.ownerUserUid}`);
                                    }}
                                />
                                <span style={{fontSize: "0.7rem"}}>
                                    {seedDetail.ownerUserName}
                                </span>
                            </Box>
                            <Box textAlign={"start"} position={"relative"}>
                                <AvatarIcon
                                    alt="userIcon"
                                    sizes={"ss"}
                                    src={"pathName"}
                                    isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                                    onMouseEnter={handleAvatarMouseEnter}
                                    onMouseLeave={handleAvatarMouseLeave}
                                    onClick={() => {
                                        setIsAvatarHovered(true);
                                        navigate(`/user/${seedDetail.ownerUserUid}`);
                                    }}
                                />
                                <span style={{fontSize: "0.7rem"}}>
                                    {seedDetail.ownerUserName}
                                </span>
                            </Box>
                            <Box textAlign={"start"} position={"relative"}>
                                <AvatarIcon
                                    alt="userIcon"
                                    sizes={"ss"}
                                    src={"pathName"}
                                    isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                                    onMouseEnter={handleAvatarMouseEnter}
                                    onMouseLeave={handleAvatarMouseLeave}
                                    onClick={() => {
                                        setIsAvatarHovered(true);
                                        navigate(`/user/${seedDetail.ownerUserUid}`);
                                    }}
                                />
                                <span style={{fontSize: "0.7rem"}}>
                                    {seedDetail.ownerUserName}
                                </span>
                            </Box>
                            <Box textAlign={"start"} position={"relative"}>
                                <AvatarIcon
                                    alt="userIcon"
                                    sizes={"ss"}
                                    src={"pathName"}
                                    isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                                    onMouseEnter={handleAvatarMouseEnter}
                                    onMouseLeave={handleAvatarMouseLeave}
                                    onClick={() => {
                                        setIsAvatarHovered(true);
                                        navigate(`/user/${seedDetail.ownerUserUid}`);
                                    }}
                                />
                                <span style={{fontSize: "0.7rem"}}>
                                    {seedDetail.ownerUserName}
                                </span>
                            </Box>
                            <Box textAlign={"start"} position={"relative"}>
                                <AvatarIcon
                                    alt="userIcon"
                                    sizes={"ss"}
                                    src={"pathName"}
                                    isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                                    onMouseEnter={handleAvatarMouseEnter}
                                    onMouseLeave={handleAvatarMouseLeave}
                                    onClick={() => {
                                        setIsAvatarHovered(true);
                                        navigate(`/user/${seedDetail.ownerUserUid}`);
                                    }}
                                />
                                <span style={{fontSize: "0.7rem"}}>
                                    {seedDetail.ownerUserName}
                                </span>
                            </Box>
                        </ScrollContainer>
                    </Box>
                </Grid>

                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{textAlign: "start"}}>
                        <Typography fontSize={"1.3rem"}>
                            概要
                        </Typography>
                        <Typography style={{
                            display: isShowAllDescription ? "none" : "block"
                        }}>{seedDetail.description.substring(0, 38).replace(/<a[^>]*>(.*?)<\/a>/gi, '')}
                            <span style={{color: "#fff"}} onClick={() => {
                                setIsShowAllDescription(!isShowAllDescription)
                            }}>...<br/>続きをみる</span>
                        </Typography>
                        <Typography style={{
                            display: isShowAllDescription ? "block" : "none"
                        }}>{seedDetail.description}
                            <span style={{color: "#fff"}} onClick={() => {
                                setIsShowAllDescription(!isShowAllDescription)
                            }}><br/>折りたたむ</span>
                        </Typography>
                    </Box>
                </Grid>

                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <ScrollContainer>
                        <Box width={"150px"} height={"150px"}>
                            <img src={seedDetail.imagePathList[0]?.path ?? ""}
                                 alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                                 style={{width: "150px", flexShrink: 0,}}
                            />
                        </Box>
                        <Box width={"150px"} height={"150px"}>
                            <img src={seedDetail.imagePathList[0]?.path ?? ""}
                                 alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                                 style={{width: "150px", flexShrink: 0,}}
                            />
                        </Box>
                        <Box width={"150px"} height={"150px"}>
                        <img src={seedDetail.imagePathList[0]?.path ?? ""}
                             alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                             style={{width: "150px", flexShrink: 0,}}
                        />
                    </Box>
                        <Box width={"150px"} height={"150px"}>
                        <img src={seedDetail.imagePathList[0]?.path ?? ""}
                             alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                             style={{width: "150px", flexShrink: 0,}}
                        />
                    </Box>
                    </ScrollContainer>
                </Grid>

                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Typography fontSize={"1.3rem"}>
                        約束する価値
                    </Typography>
                    <Typography textAlign={"center"}>
                        {viewModel.seedDetail.benefit}
                    </Typography>
                </Grid>

                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Typography fontSize={"1.0rem"}>
                        期間:&nbsp;&nbsp;{viewModel.seedDetail.termsFrom}から{viewModel.seedDetail.termsTo}
                    </Typography>
                </Grid>
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12} >
                    <Typography>{viewModel.seedDetail.hashTagStringList}</Typography>
                </Grid>
                <Grid textAlign={"center"} xs={12} sm={12} md={12} lg={12} >
                    <RoundedButton onClick={()=>{
                    }}>Join</RoundedButton>
                </Grid>
            </Grid>

            <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12} paddingTop={4}>
                <Typography fontSize={"1.3rem"}>
                    関連シード
                </Typography>
                <ScrollContainer>
                    <Box textAlign={"start"} position={"relative"}>
                        <AvatarIcon
                            alt="userIcon"
                            sizes={"ss"}
                            src={"pathName"}
                            isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                            onMouseEnter={handleAvatarMouseEnter}
                            onMouseLeave={handleAvatarMouseLeave}
                            onClick={() => {
                                setIsAvatarHovered(true);
                                navigate(`/user/${seedDetail.ownerUserUid}`);
                            }}
                        />
                        <span style={{fontSize: "0.7rem"}}>
                            {seedDetail.ownerUserName}
                        </span>
                    </Box>
                </ScrollContainer>
            </Grid>

            <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12} paddingTop={4}>
                <Typography fontSize={"1.3rem"}>
                    関連ユーザー
                </Typography>
                <ScrollContainer>
                    <Box textAlign={"start"} position={"relative"}>
                        <AvatarIcon
                            alt="userIcon"
                            sizes={"ss"}
                            src={"pathName"}
                            isAvatarHovered={isAvatarHovered}  // Pass hover state to styled component
                            onMouseEnter={handleAvatarMouseEnter}
                            onMouseLeave={handleAvatarMouseLeave}
                            onClick={() => {
                                setIsAvatarHovered(true);
                                navigate(`/user/${seedDetail.ownerUserUid}`);
                            }}
                        />
                        <span style={{fontSize: "0.7rem"}}>
                            {seedDetail.ownerUserName}
                        </span>
                    </Box>
                </ScrollContainer>
            </Grid>
        </Box>
    );
};

export default SeedDetailView;
