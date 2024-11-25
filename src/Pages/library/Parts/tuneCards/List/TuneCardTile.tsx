import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import parse from "html-react-parser";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import React from "react";
import postCardBackground from "./TuneCardTileBackground.svg";
import blogIcon from "../../../../../assets/dBlog111Icon.png";
import {useNavigate} from "react-router-dom";
import {TuneCardItem} from "./TuneCardTileList";

const TuneCardFrame = styled(Box)<{ image: string }>(({ theme, image }) => ({
    width: 110, // Fixed width for square tiles
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

const Name = styled(Typography)({
    fontWeight: "bold",
    position: "absolute",
    top: 84,
    left:-10,
    textAlign: "center",
    margin: 0, // タイルの右下から少し内側に配置
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "pre-wrap",
    color: "#ffffff"
});

const AvatarIcon = styled(Avatar)({
    position: "absolute",
    top: 39,
    right: 35,
    margin: 0, // タイルの右下から少し内側に配置
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

interface TuneCardTileProps {
    item:  TuneCardItem; // 親コンポーネントから渡されるフィード
}

const TuneCardTile: React.FC<TuneCardTileProps> = ({ item }) => {
    console.log(item.iconImage.path)
    const navigate = useNavigate();
    return (
        <Box>
            <TuneCardFrame
                image={blogIcon}
                onClick={()=>{
                    navigate(item.link);
                }}
            >
                {/* 重ねる画像を表示 */}
                <BackGroundImage src={item.iconImage?.path??''} alt="BackGround"/>
                <OverlayImage src={postCardBackground} alt="Overlay"/>

                <Name variant={"body2"} gutterBottom>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {parse(item.title.substring(0, 38).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}
                </Name>
                <Box height={"100%"}>
                    <AvatarIcon alt="userIcon" sizes={"ss"} src={item.iconImage.path} onClick={()=>{
                        navigate(item.uid);
                    }}/>
                </Box>
            </TuneCardFrame>

            <Box display={"flex"} paddingTop={1}>
                <span style={{fontSize:12}}>{parse(item.description.substring(0, 50).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}</span>
            </Box>
        </Box>
    );
}
export default TuneCardTile;