import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import TuneCardTile from "./TuneCardTile";
import {authenticationState} from "../../../../../atoms/AuthenticationState";

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

const TuneCardTileList: React.FC = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRSSFeed = async () => {
            try {
                const response = await fetch(YOUTUBE_API_URL);
                const text = await response.text();
                const parser = new DOMParser();
                const items = [
                    {title: `Yamashita`,link: "/library/cards/6923e6b6-bd0f-42cb-97b7-bc539669b080", description: "こんにちは！"},
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
                TuneCards
            </Typography>
            <GridContainer>
                {feedItems.map((item, index) => (
                   <TuneCardTile item={item}/>
                ))}
            </GridContainer>
        </div>
    );
};

export default TuneCardTileList;
