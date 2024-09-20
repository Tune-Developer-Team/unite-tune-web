import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import seedCardBackground from "./seedTileBackground.svg";
import parse from "react-html-parser";
import Avatar from "@mui/material/Avatar";
import defaultUserIcon from "../../assets/defaultUserIcon.png";
import Typography from "@mui/material/Typography";
import React from "react";
import {useNavigate} from "react-router-dom";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";

const Tile = styled(Box)<{ image: string }>(({ theme, image }) => ({
    width: 180, // Fixed width for square tiles
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
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "break-word",
    color: "#181818"
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
    item:  SeedListItem; // 親コンポーネントから渡されるシード
}

const SeedTile: React.FC<SeedTileProps> = ({ item }) => {
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        document.body.style.overflowY = 'hidden'; // Disable vertical scrolling
    };

    const handleMouseLeave = () => {
        document.body.style.overflowY = ''; // Re-enable vertical scrolling
    };

    return (
        <Box>
            <Tile
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                image={item.imagePath.path}
                onClick={()=>{
                    navigate(`/seed/${item.seedId}`);
                }}
            >
                {/* 重ねる画像を表示 */}
                <BackGroundImage src={item.imagePath.path} alt="BackGround"/>
                <OverlayImage src={seedCardBackground} alt="Overlay"/>

                <Title variant="h6" gutterBottom>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {parse(item.title.substring(0, 38).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}
                </Title>
                <Box height={"100%"}>
                    <AvatarIcon alt="userIcon" sizes={"ss"} src={item.userIconImagePath.path} onClick={()=>{
                        navigate(`/user/${item.ownerUserUid}`)
                    }}/>
                </Box>
            </Tile>

            <Box display={"flex"} paddingTop={1}>
                <span style={{fontSize:12}}>{item.description.substring(0, 50).replace(/<a[^>]*>(.*?)<\/a>/gi, '')}
                    <span style={{color:"#fff"}} onClick={() => {
                        navigate(`/seed/${item.seedId}`)
                    }}>...続きをみる</span>
                </span>
            </Box>
        </Box>
    );
}
export default SeedTile;