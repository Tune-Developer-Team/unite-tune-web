import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import {QuestListItem} from "../../Pages/home/HomeViewModelIF";
import {useNavigate} from "react-router-dom";
import QuestTile from "./QuestTile";

interface QuestTileListProps {
    questList: QuestListItem[];
}

const GridContainer = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px", // Add spacing between tiles
    padding: "16px",
    overflow: "auto",
});

const QuestTileList: React.FC<QuestTileListProps> = ({ questList }) => {
    const navigate = useNavigate();
    return (
        <div className="PostList" >
            <Typography variant="h5" component="div">
                {/*自分のアイデア、みんなのシード。*/}
                My IDEA, Our QUESTS.
            </Typography>
            <GridContainer>
                {questList.map((item, index) => (
                    <QuestTile item={item}/>
                ))}
            </GridContainer>
        </div>
    );
};

export default QuestTileList;