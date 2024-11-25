import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import ClipPostTile from "./ClipPostTile";

interface FeedItem {
    title: string;
    link: string;
    description: string;
}

const YOUTUBE_API_URL = "https://dblog111.hatenablog.jp/rss";

const GridContainer = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px", // Add spacing between tiles
    padding: "16px",
    overflow: "auto",
});

const ClipPostTileList: React.FC = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRSSFeed = async () => {
            try {
                const response = await fetch(YOUTUBE_API_URL);
                const text = await response.text();
                const parser = new DOMParser();
                const items = [
                    {title: "バリュープロポジション戦略",link: "/library/id123456789", description: "自分にできる価値提供を徹底しつつ、全体としては自分の理想的な局面に運んでいく。"},
                    {title: "顧客理解の基本スタンス",link: "/library/id234567891", description: "顧客理解はビジネスに限らず人と人との関わりの本質である。"},
                    {title: "経営資源",link: "/library/id345678912", description: "経営におけるヒト・オカネ・モノ・ジョウホウの観点から自分の戦略を立ててみる。"},
                    {title: "理念の共有の重要性",link: "/library/id456789123", description: "組織活動において理念の共有が一番大事である理由を歴史の観点から深掘りしていく。"},
                ];

                setFeedItems(items);
            } catch (error) {
                console.error("Error fetching Youtube:", error);
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
                CLIPS
            </Typography>
            <GridContainer>
                {feedItems.map((item, index) => (
                   <ClipPostTile item={item}/>
                ))}
            </GridContainer>
        </div>
    );
};

export default ClipPostTileList;
