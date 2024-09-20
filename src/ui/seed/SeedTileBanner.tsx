import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import parse from "react-html-parser"; // HTML parser
import { styled } from "@mui/system";
import seedCardBackground from "./seedTileBackground.svg";
import Tile from "./SeedTile";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import defaultUserIcon from "../../assets/defaultUserIcon.png";

interface SeedTileBannerProps {
    seedList:  SeedListItem[]; // 親コンポーネントから渡されるシードリスト
}

const ScrollContainer = styled(Box)({
    display: "flex",
    gap: 20, // Add spacing between tiles
    overflowX: "auto",
    padding: 0,
    scrollBehavior: "smooth",
    '&::-webkit-scrollbar': {
        display: 'none', // Hide scrollbar for a cleaner look
    },
});

const Title = styled(Typography)({
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "break-word",
});

const Description = styled(Typography)({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
});

const SeedTileBanner: React.FC<SeedTileBannerProps> = ({ seedList }) => {
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        document.body.style.overflowY = 'hidden'; // Disable vertical scrolling
    };

    const handleMouseLeave = () => {
        document.body.style.overflowY = ''; // Re-enable vertical scrolling
    };

    const handleScroll = (e: React.WheelEvent) => {
        if (window.innerWidth >= 1024) {
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    return (
        <ScrollContainer onWheel={handleScroll}>
            {seedList.map((item, index) => (
                <Box>
                    <Tile
                        key={index}
                        onClick={() => {
                            navigate(`/seed/${item.seedId}`);
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        image={seedCardBackground}
                    >
                        <Box>
                            <Title variant="h6" gutterBottom>
                                {item.title}
                            </Title>
                            <Description variant="body2">
                                {parse(item.description.substring(0, 150).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}...
                            </Description>
                        </Box>
                    </Tile>
                    <Box display={"flex"} paddingTop={1}>
                        <Avatar alt="userIcon" sizes={"ss"} src={item.userIconImagePath.path ?? defaultUserIcon}/>
                        <Typography paddingTop={1} variant="h6" gutterBottom>{item.ownerUserName !=　"" ?? "undefined user"}</Typography>
                    </Box>
                </Box>
            ))}
        </ScrollContainer>
    );
};

export default SeedTileBanner;
