// ScrollContainer.tsx
import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

interface ScrollContainerProps {
    children: React.ReactNode; // 子要素を受け取るための型定義
}

const StyledScrollContainer = styled(Box)({
    display: 'flex',
    gap: 20, // Add spacing between tiles
    overflowX: 'auto',
    padding: 0,
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
        display: 'none', // Hide scrollbar for a cleaner look
    },
});

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children }) => {

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

    useEffect(() => {
        document.body.style.overflowY = '';
        return () => {
        };
    }, []);

    return <StyledScrollContainer
        onWheel={handleScroll}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >{children}</StyledScrollContainer>;
};

export default ScrollContainer;