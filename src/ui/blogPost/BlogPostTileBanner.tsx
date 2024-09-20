import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import parse from "react-html-parser"; // HTML parser
import { styled } from "@mui/system";
import postCardBackground from "./BlogPostTileBackground.svg";
import Avatar from "@mui/material/Avatar";
import defaultServiceIcon from "../../assets/dBlog111Icon.png";

interface FeedItem {
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

const Title = styled(Typography)({
    fontWeight: "bold",
    overflow:"hidden",
    textOverflow: "ellipsis",
    whiteSpace: "break-word",
});

const Description = styled(Typography)({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
});

const BlogPostTileBanner: React.FC = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                console.error("Error fetching RSS blogPost:", error);
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
        <ScrollContainer onWheel={handleScroll}>
            {feedItems.map((item, index) => (
                <Box>
                    <Tile
                        key={index}
                        onClick={() => window.open(item.link, "_blank")}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        image={postCardBackground}
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
                        <Avatar alt="userIcon" sizes={"ss"} src={service.icon}/>
                        <Typography paddingTop={1} variant="h6" gutterBottom>{service.name}</Typography>
                    </Box>
                </Box>
            ))}
        </ScrollContainer>
    );
};

export default BlogPostTileBanner;
