import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";
import SeedTile from "./SeedTile";

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

const SeedTileBanner: React.FC<SeedTileBannerProps> = ({ seedList }) => {

    const handleScroll = (e: React.WheelEvent) => {
        if (window.innerWidth >= 1024) {
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    return (
        <ScrollContainer onWheel={handleScroll}>
            {seedList.map((item, index) => (
                <SeedTile item={item}/>
            ))}
        </ScrollContainer>
    );
};

export default SeedTileBanner;
