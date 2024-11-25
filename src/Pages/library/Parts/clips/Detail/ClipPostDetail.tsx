import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, CardMedia, Typography, Avatar, Button, Grid} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {profileState} from "../../../../../atoms/ProfileState";
import RoundedButton from "../../../../../ui/button/RoundedButton";
import ImagePath from "../../../../../models/data/ImagePath";
import Loader from "../../../../../ui/loading/Loader";
import generateCuriosTagChips from "../../../../../ui/curiosTag/CuriosTagChips";
import {authenticationState, AuthenticationStateIF} from "../../../../../atoms/AuthenticationState";
import Profile from "../../../../../models/Profile/Profile";

interface UniteContent {
    uniteContentId: string
    title: string
    category: string
    ownerUserUid: string
    description: string
    userIconImagePath: ImagePath
    contentImage: ImagePath
    curiosTags: string[]
}

const ClipPostDetail = () => {
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const profile = useRecoilValue<Profile>(profileState);
    const [replies, setReplies] = useState<{ [key: string]: UniteContent[] }>({});
    const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

    const urlParams = useParams<{ uniteContentId: string }>()
    const uniteContentId: string = urlParams.uniteContentId ?? '';
    const initialContent: UniteContent = {
        uniteContentId: "",
        title: "",
        category: "",
        ownerUserUid: authState.uid,
        description: profile.description,
        userIconImagePath: profile.iconImage,
        contentImage: profile.iconImage,
        curiosTags: ["マーケティング", "経営", "組織論"]
    }

    initialContent.uniteContentId = uniteContentId;
    const [uniteContent, setUniteContent] = useState<UniteContent>(initialContent);

    const navigate = useNavigate();

    const fetchDetail = async () => {
        try {
            console.log("フェッチ");
            // const newContent = await uniteContent.fetchUniteContentDetail(authState);

            const newUniteContent = {
                uniteContentId: "id12345678",
                title: "バリュープロポジション戦略",
                category: "clip",
                ownerUserUid: authState.uid,
                description: profile.description,
                userIconImagePath: profile.iconImage,
                contentImage: profile.iconImage,
                curiosTags: profile.curios
            }

            console.log(newUniteContent.uniteContentId);
            setUniteContent(newUniteContent);
        }
        catch (e){
            console.log(e);
        }
    }

    // フェッチを画面の読み込み時に実行する
    useEffect(() => {
        fetchDetail();
    }, [uniteContentId]);

    function onClickReplyHandler(uniteContent: UniteContent) {
    console.log("コメント追加");
    }

    return (
        <Box sx={{ paddingBottom: 0.2 }} width={"100%"}>
            <Box className="ContentDetail" paddingLeft={0}>
                <Loader/>
                {/*サムネイル*/}
                <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box paddingBottom={2}
                         sx={{display: {xs: "block", s: "block", md: "none", lg: "none", xl: "none"}}}>
                        <img src={uniteContent.contentImage.path ?? ""}
                             alt={"サムネイル"}
                             style={{objectFit: "cover"}}
                             width={350}
                             height={350}
                        />
                    </Box>
                </Grid>
                <Box className="ContentDetail" padding={2}>
                    {/*Title*/}
                    <Grid container spacing={2}>
                        <Grid textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{display: "flex"}}>
                                <Box sx={{textAlign: "start"}}>
                                    <Typography fontSize={"1.3rem"}>
                                        【モック】<div dangerouslySetInnerHTML={{__html: uniteContent.title}}/>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{textAlign: "start"}} paddingTop={2} width={"100%"}>
                                <Typography fontSize={"1.3rem"}>
                                    概要
                                </Typography>
                                {uniteContent.description}
                            </Box>

                            <Box sx={{textAlign: "start"}} paddingTop={2} width={"100%"}>
                                <Typography fontSize={"1.3rem"}>
                                    オーナー
                                </Typography>
                                <Box textAlign={"start"} position={"relative"}>
                                    <Avatar
                                        alt="userIcon"
                                        sizes={"ss"}
                                        src={"pathName"}
                                        onClick={() => {
                                            navigate(`/user/${uniteContent.ownerUserUid}`);
                                        }}
                                    />
                                    <span style={{fontSize: "0.7rem"}} color={"#fff"}>
                                <span>
                                    山田太郎
                                </span>
                        </span>
                                </Box>
                            </Box>

                            <Box sx={{textAlign: "start"}} paddingTop={2} width={"100%"}>
                                <Typography fontSize={"1.3rem"}>
                                    関連コンテンツ
                                </Typography>
                            </Box>

                            <Box sx={{textAlign: "start"}} paddingTop={2} width={"100%"}>
                                <Typography fontSize={"1.3rem"}>
                                    カテゴリー
                                </Typography>
                                Clip
                            </Box>

                            <Box sx={{textAlign: "start"}} paddingTop={2} width={"100%"}>
                                <Typography fontSize={"1.3rem"}>
                                    タグ
                                </Typography>
                                <Typography fontSize={10}>
                                    {generateCuriosTagChips(uniteContent.curiosTags)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default ClipPostDetail;
