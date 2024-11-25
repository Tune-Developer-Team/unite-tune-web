import {TileInfoIF} from "./AllTabView";
import React from "react";
import Box from "@mui/material/Box";
import blogIcon from "../../../assets/dBlog111Icon.png";
import {styled} from "@mui/system";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import parse from "html-react-parser";

interface PickUpProps {
    item:  TileInfoIF;
}

const PickUp: React.FC<PickUpProps> = ({ item }) => {
    const Tile = styled(Box)<{ image: string }>(({theme, image}) => ({
        width: 80, // Fixed width for square tiles
        height: 80, // Fixed height for square tiles
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
        fontWeight: "thin",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "break-word",
        color: "#ffffff",
        paddingTop: 6,
        paddingLeft: 4,
        paddingRight: 2,
        paddingBottom: 0,
        fontSize:16,
    });
    const Description = styled(Typography)({
        fontWeight: "thin",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "break-word",
        color: "#ffffff",
        padding: 0,
        margin:0,
        fontSize:12,
    });

    const AvatarIcon = styled(Avatar)({
        position: "absolute",
        top: 40,
        left: 40,
        margin: 8, // タイルの右下から少し内側に配置
        zIndex: 1, // 背景画像の前に表示されるように調整
        width: 30,
        height: 30,
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


    return (
        <Box sx={{display: "flex", backgroundColor: "rgba(63,63,63,0.76)", borderRadius: 1}} margin={1}
             onClick={() => {window.open(item.link, "_blank");}}>
            <Tile
                image={blogIcon}
                onClick={() => {
                    window.open(item.link, "_blank");
                }}
            >
                {/* 重ねる画像を表示 */}
                <BackGroundImage src={item.image} alt="BackGround"/>
                <OverlayImage src={item.image} alt="Overlay"/>
                <Box height={"100%"}>
                    <AvatarIcon alt="userIcon" sizes={"ss"} src={item.userIcon} onClick={() => {
                        window.open(`user/${item.ownerUid}`, "_blank");
                    }}/>
                </Box>
            </Tile>
            <Box paddingLeft={1}>
                <Title variant="h6">
                    {parse(item.title.substring(0, 14).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}
                </Title>
                <Description>
                    {parse(item.description.substring(0, 36).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}...
                </Description>
            </Box>
        </Box>
    );
}

export default PickUp