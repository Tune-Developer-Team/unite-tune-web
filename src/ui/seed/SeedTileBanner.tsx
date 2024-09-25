import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";
import SeedTile from "./SeedTile";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

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

    useEffect(() => {
        document.body.style.overflowY = '';
        return () => {
        };
    }, [input]);


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
        <ScrollContainer
            onWheel={handleScroll}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {seedList.map((item, index) => (
                <SeedTile item={item}/>
            ))}
        </ScrollContainer>
    );
};

export default SeedTileBanner;
