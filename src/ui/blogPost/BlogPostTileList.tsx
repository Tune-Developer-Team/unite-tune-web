import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import parse from "react-html-parser"; // HTML parser
import { styled } from "@mui/system";

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

const Tile = styled(Card)(({ theme }) => ({
    width: "100%", // Full width of grid item
    height: "250px", // Fixed height for square tiles
    color: "#232323",
    backgroundColor: "#fff", // White-based modern design
    boxShadow: "#fff", // Use theme shadows
    borderRadius: theme.shape.borderRadius,
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "scale(1.05)",
    },
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden", // Hide overflowing content
}));

const Title = styled(Typography)({
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
});

const Description = styled(Typography)({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
        <div className="PostList" style={{paddingLeft: '5rem'}}>
            <Typography variant="h5" component="div">
                {/*他人の考えに触れる。アイデアに出会う。*/}
                Meet other's INTERESTS. Tune my IDEA.
            </Typography>
            <GridContainer>
                {feedItems.map((item, index) => (
                    <Tile
                        key={index}
                        onClick={() => window.open(item.link, "_blank")}
                    >
                        <CardContent>
                            <Title variant="h6" gutterBottom>
                                {item.title}
                            </Title>
                            <Description variant="body2">
                                {parse(item.description.substring(0, 150).replace(/<a[^>]*>(.*?)<\/a>/gi, ''))}...
                            </Description>
                        </CardContent>
                    </Tile>
                ))}
            </GridContainer>
        </div>
    );
};

export default BlogPostTileList;
