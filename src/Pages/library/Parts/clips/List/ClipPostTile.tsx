import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import parse from "html-react-parser";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import React from "react";
import postCardBackground from "./ClipPostTileBackground.svg";

import blogIcon from "../../../../../assets/dBlog111Icon.png";
import {useNavigate} from "react-router-dom";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {ClipFeedItem} from "./ClipPostTileList";

const Tile = styled(Box)<{ image: string }>(({ theme, image }) => ({
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

const Title = styled(Typography)({
    position: "absolute",
    top: 30,
    left: 0,
    margin: 8, // タイルの右下から少し内側に配置
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "break-word",
    color: "#ffffff"
});

const AvatarIcon = styled(Avatar)({
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 8, // タイルの右下から少し内側に配置
    zIndex: 1, // 背景画像の前に表示されるように調整
    transition: "transform 0.2s ease-in-out",
    pointerEvents: "auto", // クリックイベントを受け取る
    "&:hover": {
        transform: "scale(1.5)",
    },
});

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

const BackGroundImage = styled("img")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // タイル全体にフィットさせる
    zIndex: -2, // タイル背景より前面に表示
    pointerEvents: "none" // クリックなどのイベントを無視
});

interface SeedTileProps {
    item:  ClipFeedItem; // 親コンポーネントから渡されるフィード
}

const ClipPostTile: React.FC<SeedTileProps> = ({ item }) => {
    const navigate = useNavigate();
    return (
        <Box>
            <Tile
                image={blogIcon}
                onClick={()=>{
                    navigate(item.link);
                }}
            >
                {/* 重ねる画像を表示 */}
                <BackGroundImage src={blogIcon} alt="BackGround"/>
                <OverlayImage src={postCardBackground} alt="Overlay"/>

                <Title variant="h6" gutterBottom>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {parse(item.title.substring(0, 38).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}
                </Title>
                <Box height={"100%"}>
                    <PlayIcon/>
                </Box>
                <Box height={"100%"}>
                    <AvatarIcon alt="userIcon" sizes={"ss"} src={""}/>
                </Box>
            </Tile>

            <Box display={"flex"} paddingTop={1}>
                <span style={{fontSize:12}}>{parse(item.description.substring(0, 50).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}
                    <span style={{color:"#fff"}}>...続きをみる</span>
                </span>
            </Box>
        </Box>
    );
}
export default ClipPostTile;