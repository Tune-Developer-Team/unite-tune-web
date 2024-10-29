import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Think } from "../../../models/ThinkTank/Think";
import { useNavigate } from "react-router-dom";
import {FetchTimeLineSearchIF, ThinkTable} from "../../../models/ThinkTank/ThinkTable";
import { useRecoilState } from "recoil";
import { authenticationState, AuthenticationStateIF } from "../../../atoms/AuthenticationState";

interface ThinkTimelineProps {
    thinkList: Think[];
    onClickReplyHandler: (think: Think) => any;
    onClickFavoriteHandler: (think: Think) => any;
    onClickRethinkHandler: (think: Think) => any;
    onClickShareHandler: (think: Think) => any;
}

const ThinkTimeline: React.FC<ThinkTimelineProps> = ({ thinkList, onClickReplyHandler, onClickFavoriteHandler, onClickRethinkHandler, onClickShareHandler }) => {
    const navigate = useNavigate();
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const [replies, setReplies] = useState<{ [key: string]: Think[] }>({});
    const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

    const toggleReplyVisibility = async (parentThinkId: string) => {
        if (showReplies[parentThinkId]) {
            // If replies are visible, hide them
            setShowReplies(prev => ({ ...prev, [parentThinkId]: false }));
        } else {
            // Fetch replies if not already loaded, then show them
            // 検索条件
            const search: FetchTimeLineSearchIF = {
                limit: 20,
                excludeReplies: "false",
                parentThinkId: parentThinkId,
                ownerUserUid: ""
            }

            if (!replies[parentThinkId]) {
                const thinkTable: ThinkTable = ThinkTable.initThinkTable();
                const thinkTable1: ThinkTable = await thinkTable.fetchThinkList({
                    accessToken: authState.accessToken,
                    uid: authState.uid
                }, search);
                setReplies(prevReplies => ({
                    ...prevReplies,
                    [parentThinkId]: thinkTable1.thinkList
                }));
            }
            setShowReplies(prev => ({ ...prev, [parentThinkId]: true }));
        }
    };

    return (
        <Box sx={{ height: "85vh", overflow: "auto" }}>
            {thinkList.map((think, index) => (
                <Box key={index} sx={{ paddingBottom: 0.2 }}>
                    <Card sx={{ padding: 0, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 6, cursor: 'pointer' } }}>
                        <CardContent sx={{ paddingTop: 2 }}>
                            <CardMedia sx={{ textAlign: "start" }}>
                                <Box sx={{display: "flex"}} onClick={() => navigate(`/user/${think.ownerUserUid}`)}>
                                    <Avatar src={think.userIconImagePath.path} alt="user_icon_image" />
                                    <Typography sx={{ alignContent: "center", paddingLeft: 1 }} fontSize={14}>{think.thinkUserName}</Typography>
                                </Box>
                            </CardMedia>
                            <Box paddingTop={2}>
                                <Typography variant="body1" color="text.primary" textAlign="start" dangerouslySetInnerHTML={{ __html: think.getSentenceWithHtml() }} />
                                <Typography variant="body2" color="text.secondary" textAlign="start">{think.curiosTags.join(', ')}</Typography>
                            </Box>
                            <Box sx={{ display: "flex" }} paddingTop={1}>
                                <ReplyIcon sx={{ color: "white", width: 18, marginRight: 3 }} onClick={() => onClickReplyHandler(think)} />
                                <FavoriteIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickFavoriteHandler(think)} />
                                <RepeatIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickRethinkHandler(think)} />
                                <IosShareIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickShareHandler(think)} />
                                <Box textAlign={"end"} width={"100%"}>
                                    <Typography color="gray" fontSize={10}>
                                        {think.getTimeFormattedStamp()}
                                    </Typography>
                                </Box>
                            </Box>
                            {think.hasReply && (
                                <Box textAlign={"center"} fontSize={12} paddingTop={2} onClick={() => toggleReplyVisibility(think.thinkId)}>
                                    {showReplies[think.thinkId] ? "返信を非表示にする" : "返信を表示する"}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                    {showReplies[think.thinkId] && replies[think.thinkId] && (
                        <Box>
                            {replies[think.thinkId].map((reply, idx) => (
                                <Box key={idx}>
                                    <Card sx={{padding: 0, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': {boxShadow: 6, cursor: 'pointer'}}}>
                                        <CardContent sx={{paddingTop:0}}>
                                            <CardMedia sx={{ textAlign: "start"}}>
                                                <Box sx={{ display: "flex"}}>
                                                    <Typography textAlign={"center"}>
                                                        Reply by
                                                    </Typography>
                                                    <Box display={"inline-flex"} height={30} width={30}>
                                                        <Avatar src={reply.userIconImagePath.path} alt={'user_icon_image'} style={{ height: "100%", width: "100%" }}/>
                                                        <Typography sx={{ alignContent: "center", paddingLeft: 1 }} fontSize={14}>{reply.thinkUserName}</Typography>
                                                    </Box>
                                                </Box>

                                            </CardMedia>
                                            <Box paddingTop={2}>
                                                <Typography variant="body1" color="text.primary" textAlign="start" dangerouslySetInnerHTML={{ __html: reply.getSentenceWithHtml() }} />
                                                <Typography variant="body2" color="text.secondary" textAlign="start">{reply.curiosTags.join(', ')}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex" }} paddingTop={1}>
                                                <ReplyIcon sx={{ color: "white", width: 18, marginRight: 3 }} onClick={() => onClickReplyHandler(reply)} />
                                                <FavoriteIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickFavoriteHandler(reply)} />
                                                <RepeatIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickRethinkHandler(reply)} />
                                                <IosShareIcon sx={{ width: 18, marginRight: 3 }} onClick={() => onClickShareHandler(reply)} />
                                                <Box textAlign={"end"} width={"100%"}>
                                                    <Typography color="gray" fontSize={10}>
                                                        {reply.getTimeFormattedStamp()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default ThinkTimeline;
