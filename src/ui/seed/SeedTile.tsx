import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import seedCardBackground from "./seedTileBackground.svg";
import parse from "react-html-parser";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";
import {AvatarIcon} from "../avatarIcon/AvatarIcon";

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
    const [isAvatarHovered, setIsAvatarHovered] = useState(false); // State to track hover

    const handleAvatarMouseEnter = () => {
        console.log("hovering");
        setIsAvatarHovered(true); // Set hover state to true
    };

    const handleAvatarMouseLeave = () => {
        setIsAvatarHovered(false); // Reset hover state
    };

    const navigate = useNavigate();
    return (
        <Box>
            <Tile
                image={item.imagePath.path}
                onClick={()=>{
                    if(!isAvatarHovered){
                        navigate(`/seed/${item.seedId}`);
                    }
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
                    <AvatarIcon
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0
                        }}
                        alt="userIcon"
                        sizes={"ss"}
                        src={item.userIconImagePath.path}
                        isAvatarHovered={isAvatarHovered}
                        onMouseEnter={handleAvatarMouseEnter}
                        onMouseLeave={handleAvatarMouseLeave}
                        onClick={() => {
                            console.log("ユーザー");
                            setIsAvatarHovered(true);
                            navigate(`/user/${item.ownerUserUid}`);
                        }}
                    />
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