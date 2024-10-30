import React  from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { Think } from "../../../models/ThinkTank/Think";
import {useNavigate, useOutletContext} from "react-router-dom";
import MarkdownRenderer from "../../../util/MarkdownRenderer";
import {sanitizeMarkdown} from "../../../util/sanitizeMarkdown";

interface ThinkTimelineProps {}

const ThinkTimeline: React.FC<ThinkTimelineProps> = ({}) => {
    const { thinkList, setTargetThink, setParentThink } = useOutletContext<{
        thinkList: Think[];
        setTargetThink: React.Dispatch<React.SetStateAction<Think>>
        setParentThink: React.Dispatch<React.SetStateAction<Think>>
    }>();

    const navigate = useNavigate();

    function onClickReplyHandler(think: Think) {
        setParentThink(think);
    }

    return (
        <Box sx={{ height: "85vh", overflow: "auto" , width: "100%"}}>
            {thinkList.map((think, index) => (
                <Box key={index} sx={{ paddingBottom: 0.2 }}>
                    <Card sx={{ padding: 0, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 6, cursor: 'pointer' } }}>
                        <CardContent sx={{ paddingTop: 2 }}>
                            <CardMedia sx={{ textAlign: "start" }}>
                                <Box sx={{display: "flex"}}>
                                    <Avatar src={think.userIconImagePath.path} alt="user_icon_image" onClick={()=>{
                                        navigate(`/user/${think.ownerUserUid}`);
                                    }}/>
                                    <Typography sx={{ alignContent: "center", paddingLeft: 1 }} fontSize={14}>{think.thinkUserName}</Typography>
                                </Box>
                            </CardMedia>
                            <Box paddingTop={2} onClick={()=>{
                                setTargetThink(think);
                            }}>
                                <Typography variant="body1" color="text.primary" textAlign="start">
                                    <MarkdownRenderer content={sanitizeMarkdown(think.sentence)}/>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="start">{think.curiosTags.join(', ')}</Typography>
                            </Box>
                            <Box sx={{ display: "flex" }} paddingTop={1}>
                                <ReplyIcon sx={{ color: "white", width: 18, marginRight: 3 }} onClick={() => onClickReplyHandler(think)} />
                                {/*<FavoriteIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickFavoriteHandler(think)} />*/}
                                {/*<RepeatIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickRethinkHandler(think)} />*/}
                                {/*<IosShareIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickShareHandler(think)} />*/}
                                <Box textAlign={"end"} width={"100%"}>
                                    <Typography color="gray" fontSize={10}>
                                        {think.getTimeFormattedStamp()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
};

export default ThinkTimeline;
