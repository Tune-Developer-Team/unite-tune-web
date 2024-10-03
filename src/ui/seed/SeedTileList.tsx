import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import {SeedListItem} from "../../scene/home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";
import SeedTile from "./SeedTile";

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

const SeedTileList: React.FC<SeedTileListProps> = ({ seedList }) => {
    const navigate = useNavigate();
    return (
        <div className="PostList" >
            <Typography variant="h5" component="div">
                {/*自分のアイデア、みんなのシード。*/}
                My IDEA, Our SEED.
            </Typography>
            <GridContainer>
                {seedList.map((item, index) => (
                    <SeedTile item={item}/>
                ))}
            </GridContainer>
        </div>
    );
};

export default SeedTileList;