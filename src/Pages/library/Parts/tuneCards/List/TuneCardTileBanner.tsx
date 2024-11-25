import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import defaultServiceIcon from "../../../../../assets/dBlog111Icon.png";
import TuneCardTile from "./TuneCardTile";

export interface FeedItem {
    title: string;
    link: string;
    description: string;
}

const service = {
    name: "DBlog111",
    icon: defaultServiceIcon,
    feed: process.env.REACT_APP_TARGET_BLOG_RSS as string
}

// 取得件数
const MAX_FEED_COUNT = 5;

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

const TuneCardTileBanner: React.FC = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflowY = '';
        const fetchRSSFeed = async () => {
            try {
                const response = await fetch(service.feed);
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "application/xml");

                const items = Array.from(xml.querySelectorAll("item")).slice(0, MAX_FEED_COUNT).map((item) => ({
                    title: item.querySelector("title")?.textContent || "No Title",
                    link: item.querySelector("link")?.textContent || "#",
                    description: item.querySelector("description")?.textContent || "",
                }));

                setFeedItems(items);
            } catch (error) {
                console.error("Error fetching RSS dBlog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRSSFeed();
    }, []);

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

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <ScrollContainer
            onWheel={handleScroll}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {feedItems.map((item, index) => (
                <TuneCardTile item={item}/>
            ))}
        </ScrollContainer>
    );
};

export default TuneCardTileBanner;
