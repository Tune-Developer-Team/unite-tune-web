import {styled} from "@mui/system";
import Box from "@mui/material/Box";

const Tile = styled(Box)<{ image: string }>(({ theme, image }) => ({
    backgroundImage: `url(${image})`, // 背景画像を動的に設定
    backgroundSize: 'cover',           // 画像をコンテナのサイズにフィット
    backgroundPosition: 'center',      // 画像を中央に表示
    width: 180, // Fixed width for square tiles
    height: 180, // Fixed height for square tiles
    flexShrink: 0,
    color: "#232323",
    // backgroundColor: "#9b9b9b", // White-based modern design
    boxShadow: "#fff",
    borderRadius: theme.shape.borderRadius,
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "scale(1.05)",
    },
    padding:  5,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden", // Hide overflowing content
}));

export default Tile