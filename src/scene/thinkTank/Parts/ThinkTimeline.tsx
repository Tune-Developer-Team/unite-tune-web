// ThinkTimeline.tsx
import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import IosShareIcon from '@mui/icons-material/IosShare';
import {Think} from "../../../models/ThinkTank/Think";

interface ThinkTimelineProps {
    thinkList: any[];
    onClickReplyHandler: (think:Think) => any
    onClickFavoriteHandler: (think:Think) => any
    onClickRethinkHandler: (think:Think) => any
    onClickShareHandler:(think:Think) => any
}

const ThinkTimeline: React.FC<ThinkTimelineProps> = ({ thinkList, onClickReplyHandler, onClickFavoriteHandler, onClickRethinkHandler, onClickShareHandler }) => {
    return (
        <Box sx={{ height: "85vh", overflow: "auto" }}>
            {thinkList.map((think, index) => (
                <Box key={index} sx={{ paddingBottom: 0.2 }}>
                    <Card sx={{ padding: 0, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 6, cursor: 'pointer' } }}>
                        <CardContent sx={{ paddingTop: 2 }}>
                            <CardMedia sx={{ textAlign: "start" }}>
                                <Box sx={{ display: "flex" }}>
                                    <Avatar src={think.userIconImagePath.path} alt="user_icon_image" />
                                    <Typography sx={{ alignContent: "center", paddingLeft: 1 }} fontSize={14}>{think.thinkUserName}</Typography>
                                </Box>
                                <Typography color="gray" fontSize={10} sx={{ paddingLeft: 6 }}>{think.getTimeFormattedStamp()}</Typography>
                            </CardMedia>
                            <Box paddingTop={2}>
                                <Typography variant="body1" color="text.primary" textAlign="start" dangerouslySetInnerHTML={{ __html: think.getSentenceWithHtml() }} />
                                <Typography variant="body2" color="text.secondary" textAlign="start">{think.curiosTags.join(', ')}</Typography>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <ReplyIcon sx={{ color: "white", width: 18, marginRight: 3 }} onClick={() => onClickReplyHandler(think)} />
                                <FavoriteIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickFavoriteHandler(think)} />
                                <RepeatIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickRethinkHandler(think)} />
                                <IosShareIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickShareHandler(think)} />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
};

export default ThinkTimeline;
