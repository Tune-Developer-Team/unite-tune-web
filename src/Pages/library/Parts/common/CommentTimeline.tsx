import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar, Button } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { Think } from "../../../../models/ThinkTank/Think";
import { useNavigate, useOutletContext } from "react-router-dom";
import MarkdownRenderer from "../../../../util/MarkdownRenderer";
import { sanitizeMarkdown } from "../../../../util/sanitizeMarkdown";
import { FetchTimeLineSearchIF, ThinkTable } from "../../../../models/ThinkTank/ThinkTable";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authenticationState, AuthenticationStateIF } from "../../../../atoms/AuthenticationState";
import {
    offsetState,
    refreshTimelineState,
    scrollPositionState,
    thinkListState
} from "../../../../atoms/ThinkTimelineState";


const CommentTimeline: React.FC = () => {
    const { setTargetThink, setParentThink } = useOutletContext<{
        setTargetThink: React.Dispatch<React.SetStateAction<Think>>;
        setParentThink: React.Dispatch<React.SetStateAction<Think>>;
    }>();

    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const [refreshTimeline, setRefreshTimeline] = useRecoilState(refreshTimelineState);
    const [thinkList, setThinkList] = useRecoilState(thinkListState);
    const [offset, setOffset] = useRecoilState(offsetState);
    const [scrollPosition, setScrollPosition] = useRecoilState(scrollPositionState);
    const setScrollPositionOnly = useSetRecoilState(scrollPositionState);

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const thinkTable = ThinkTable.initThinkTable();

    const limit = 10;
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const fetchMoreThinks = async (currentOffset: number) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        const search: FetchTimeLineSearchIF = {
            limit: limit,
            offset: currentOffset,
            excludeReplies: "true",
            parentThinkId: "",
            ownerUserUid: "",
        };

        const newThinkTable = await thinkTable.fetchThinkList({
            accessToken: authState.accessToken,
            uid: authState.uid
        }, search);

        const newThinkList = newThinkTable.thinkList;
        setIsLoading(false);

        if (newThinkList.length === 0) {
            setHasMore(false);
        } else {
            setThinkList(prevThinkList => {
                const existingIds = new Set(prevThinkList.map(think => think.thinkId));
                return [...prevThinkList, ...newThinkList.filter(think => !existingIds.has(think.thinkId))];
            });
        }

        // 再レンダリングフラグ
        setRefreshTimeline(false);
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            setScrollPositionOnly(scrollTop);

            // 最上部に到達した際に更新を実行
            if (scrollTop === 0) {
                handleRefresh();
            }

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setOffset(prevOffset => {
                    const newOffset = prevOffset + limit;
                    fetchMoreThinks(newOffset);
                    return newOffset;
                });
            }
        }
    };

    const handleRefresh = () => {
        setOffset(0);
        setThinkList([]);
        setHasMore(true);
        fetchMoreThinks(0);
    };

    useEffect(() => {
        // 他コンポーネントから強制的に再読み込みを行う
        if (refreshTimeline) {
            console.log("他コンポーネントから強制的に再読み込みを行う");
            handleRefresh()
        }
    }, [refreshTimeline]);


    useEffect(() => {
        if (thinkList.length === 0 && hasMore) {
            fetchMoreThinks(offset);
        }
    }, [thinkList, offset, hasMore]);

    useEffect(() => {
        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener('scroll', handleScroll);
            currentContainer.scrollTop = scrollPosition;
        }

        return () => {
            if (currentContainer) {
                currentContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [scrollPosition]);

    function onClickReplyHandler(think: Think) {
        setParentThink(think);
    }

    return (
        <Box
            ref={containerRef}
            sx={{ height: "85vh", overflow: "auto", width: "100%" }}
        >
            {thinkList.map((think, index) => (
                <Box key={index} sx={{ paddingBottom: 0.2 }}>
                    <Card sx={{ padding: 0, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 6, cursor: 'pointer' } }}>
                        <CardContent sx={{ paddingTop: 2 }}>
                            <CardMedia sx={{ textAlign: "start" }}>
                                <Box sx={{ display: "flex" }}>
                                    <Avatar src={think.userIconImagePath.path} alt="user_icon_image" onClick={() => {
                                        navigate(`/user/${think.ownerUserUid}`);
                                    }} />
                                    <Typography sx={{ alignContent: "center", paddingLeft: 1 }} fontSize={14}>{think.thinkUserName}</Typography>
                                </Box>
                            </CardMedia>
                            <Box paddingTop={2} onClick={() => {
                                setTargetThink(think);
                            }}>
                                <Typography variant="body1" color="text.primary" textAlign="start">
                                    <MarkdownRenderer content={sanitizeMarkdown(think.sentence)} />
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="start">{think.curiosTags.join(', ')}</Typography>
                            </Box>
                            <Box sx={{ display: "flex" }} paddingTop={1}>
                                <ReplyIcon sx={{ color: "white", width: 18, marginRight: 3 }} onClick={() => onClickReplyHandler(think)} />
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

export default CommentTimeline;
