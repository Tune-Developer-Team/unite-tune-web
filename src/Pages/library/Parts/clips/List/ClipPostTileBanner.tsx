import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import defaultServiceIcon from "../../../../../assets/dBlog111Icon.png";
import ClipPostTile from "./ClipPostTile";
import {ClipFeedItem} from "./ClipPostTileList";

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

const ClipPostTileBanner: React.FC = () => {
    const [feedItems, setFeedItems] = useState<ClipFeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflowY = '';
        const fetchRSSFeed = async () => {
            try {
                const response = await fetch(service.feed);
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "application/xml");

                const items = [
                    {title: "バリュープロポジション戦略",uniteContentId: "id123456789id123456789qdw", uid: "id123456789id123456789",link: "/library/id123456789", description: "自分にできる価値提供を徹底しつつ、全体としては自分の理想的な局面に運んでいく。"},
                    {title: "顧客理解の基本スタンス",uniteContentId: "id123456789id123456789qdw", uid: "id123456789id123456789", link: "/library/id234567891", description: "顧客理解はビジネスに限らず人と人との関わりの本質である。"},
                    {title: "経営資源",link: "/library/id345678912", uniteContentId: "id123456789id123456789qdw", uid: "id123456789id123456789" ,description: "経営におけるヒト・オカネ・モノ・ジョウホウの観点から自分の戦略を立ててみる。"},
                    {title: "理念の共有の重要性",link: "/library/id456789123", uniteContentId: "id123456789id123456789qdw", uid: "id123456789id123456789", description: "組織活動において理念の共有が一番大事である理由を歴史の観点から深掘りしていく。"},
                ];

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
                <ClipPostTile item={item}/>
            ))}
        </ScrollContainer>
    );
};

export default ClipPostTileBanner;
