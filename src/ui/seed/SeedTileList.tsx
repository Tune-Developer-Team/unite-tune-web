import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import parse from "react-html-parser"; // HTML parser
import { styled } from "@mui/system";
import Tile from "./SeedTile";
import postCardBackground from "./seedTileBackground.svg";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";

interface FeedItem {
    title: string;
    link: string;
    description: string;
}

interface SeedTileListProps {
    seedList: SeedListItem[];
}

const GridContainer = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px", // Add spacing between tiles
    padding: "16px",
    overflow: "auto",
});

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

const SeedTileList: React.FC<SeedTileListProps> = ({ seedList }) => {
    const navigate = useNavigate();
    return (
        <div className="PostList" style={{paddingLeft: '5rem'}}>
            <Typography variant="h5" component="div">
                {/*自分のアイデア、みんなのシード。*/}
                My IDEA, Our SEED.
            </Typography>
            <GridContainer>
                {seedList.map((item, index) => (
                    <Tile
                        key={index}
                        onClick={()=>{
                            navigate(`/seed/${item.seedId}`);
                        }}
                        image={postCardBackground}
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

export default SeedTileList;