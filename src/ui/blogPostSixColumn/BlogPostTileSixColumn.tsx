import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import defaultServiceIcon from "../../assets/dBlog111Icon.png";
import {Grid} from "@mui/material";
import BlogPostSixColumnTile from "./BlogPostSixColumnTile";

export interface FeedItem {
    title: string;
    link: string;
    description: string;
}

export const BlogService = {
    name: "DBlog111",
    icon: defaultServiceIcon,
    feed: process.env.REACT_APP_TARGET_BLOG_RSS as string
}

// 取得件数
const MAX_FEED_COUNT = 6;

const BlogPostTileSixColumn: React.FC = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflowY = '';
        const fetchRSSFeed = async () => {
            try {
                const response = await fetch(BlogService.feed);
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

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Grid container spacing={2} className={"new-arrival-banner"} paddingBottom={5}>
            {feedItems.map((item, index) => (
                <Grid xs={6} sm={6} md={6} lg={6} paddingLeft={1}>
                    <BlogPostSixColumnTile item={item}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default BlogPostTileSixColumn;
