import React, {useEffect, useState} from 'react';
import {Box, Typography, Avatar, Grid} from '@mui/material';
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {profileState} from "../../../../../atoms/ProfileState";
import ImagePath from "../../../../../models/data/ImagePath";
import Loader from "../../../../../ui/loading/Loader";
import generateCuriosTagChips from "../../../../../ui/curiosTag/CuriosTagChips";
import {authenticationState, AuthenticationStateIF} from "../../../../../atoms/AuthenticationState";
import Profile from "../../../../../models/Profile/Profile";
import {styled} from "@mui/system";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import postCardBackground from "../List/ClipPostTileBackground.svg";

interface UniteContent {
    uniteContentId: string
    title: string
    category: string
    ownerUserUid: string
    description: string
    userIconImagePath: ImagePath
    contentImage: ImagePath
    facets: string[]
}

const SamNail = styled(Box)<{ image: string }>(({ theme, image }) => ({
    width: "100%",
    height: 180, // Fixed height for square tiles
    flexShrink: 0,
    color: "#232323",
    position: "relative",  // 子要素の絶対位置を指定可能に
    borderRadius: theme.shape.borderRadius,
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "scale(1.05)",
    },
    padding: 5,
    overflow: "hidden", // Hide overflowing content
    zIndex: 0,
}));

const PlayIcon = styled(PlayCircleIcon)({
    position: "absolute",
    fontSize: "xxx-large",
    color: "white",
    top: 70,
    left: 130,
    margin: 8, // タイルの右下から少し内側に配置
    zIndex: 1, // 背景画像の前に表示されるように調整
    transition: "transform 0.2s ease-in-out",
    pointerEvents: "auto", // クリックイベントを受け取る
    "&:hover": {
        transform: "scale(1.5)",
    },
});

const OverlayImage = styled("img")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // タイル全体にフィットさせる
    zIndex: -1, // タイル背景より前面に表示
    pointerEvents: "none" // クリックなどのイベントを無視
});

const ClipPostDetail = () => {
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const profile = useRecoilValue<Profile>(profileState);
    const [replies, setReplies] = useState<{ [key: string]: UniteContent[] }>({});
    const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

    const urlParams = useParams<{ uniteContentId: string }>()
    const uniteContentId: string = urlParams.uniteContentId ?? '';
    const initialContent: UniteContent = {
            uniteContentId: "id12345678",
            title: "バリュープロポジション戦略",
            category: "clip",
            ownerUserUid: "12345qqwer",
            description: "",
            userIconImagePath: ImagePath.create({alt:"",path:""}),
            contentImage: ImagePath.create({alt:"",path:""}),
            facets: ["マーケティング", "経営", "組織論"]
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
                ownerUserUid: "12345qqwer",
                description: "",
                userIconImagePath: ImagePath.create({alt:"",path:""}),
                contentImage: ImagePath.create({alt:"",path:""}),
                facets: ["マーケティング", "経営", "組織論"]
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
                <SamNail
                    image={""}
                    onClick={() => {
                        const isConfirm = window.confirm("Youtubeで動画を視聴します.");
                        if (!isConfirm) {
                            return;
                        }
                        window.open("https://youtube.com", "_blank");
                    }}
                >
                    <OverlayImage src={postCardBackground} alt="Overlay"/>
                    <Box height={"100%"}>
                        <PlayIcon/>
                    </Box>
                </SamNail>

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
                                    {generateCuriosTagChips(uniteContent.facets)}
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
