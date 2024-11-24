import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import BlogPostTile from "./BlogPostTile";

interface FeedItem {
    title: string;
    link: string;
    description: string;
}

const RSS_URL = "https://dblog111.hatenablog.jp/rss";

const GridContainer = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px", // Add spacing between tiles
    padding: "16px",
    overflow: "auto",
});

const BlogPostTileList: React.FC = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRSSFeed = async () => {
            try {
                const response = await fetch(RSS_URL);
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "application/xml");

                const items = Array.from(xml.querySelectorAll("item")).map((item) => ({
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

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="PostList" >
            <Typography variant="h5" component="div">
                DBlog
            </Typography>
            <GridContainer>
                {feedItems.map((item, index) => (
                   <BlogPostTile item={item}/>
                ))}
            </GridContainer>
        </div>
    );
};

export default BlogPostTileList;
