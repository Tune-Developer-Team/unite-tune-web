import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { Think } from "../../../models/ThinkTank/Think";
import { useNavigate, useOutletContext } from "react-router-dom";
import MarkdownRenderer from "../../../util/MarkdownRenderer";
import { sanitizeMarkdown } from "../../../util/sanitizeMarkdown";
import { FetchTimeLineSearchIF, ThinkTable } from "../../../models/ThinkTank/ThinkTable";
import { useRecoilState } from "recoil";
import { authenticationState, AuthenticationStateIF } from "../../../atoms/AuthenticationState";

const ThinkTimeline: React.FC = () => {
    const { setTargetThink, setParentThink } = useOutletContext<{
        setTargetThink: React.Dispatch<React.SetStateAction<Think>>;
        setParentThink: React.Dispatch<React.SetStateAction<Think>>;
    }>();

    const thinkTable = ThinkTable.initThinkTable();
    const [authState] = useRecoilState<AuthenticationStateIF>(authenticationState);
    const [thinkList, setThinkList] = useState<Think[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

    const fetchMoreThinks = async (currentOffset: number) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        console.log('[fetchMoreThinks]');
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

        if (newThinkList.length === 0) {
            console.log("No more data available.");
            setHasMore(false);
        } else {
            setThinkList(prevThinkList => {
                console.log("Updating list");
                const existingIds = new Set(prevThinkList.map(think => think.thinkId));
                return [...prevThinkList, ...newThinkList.filter(think => !existingIds.has(think.thinkId))];
            });
        }

        setIsLoading(false);
    };

    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            console.log(`scrollTop: ${scrollTop}, scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}`);
            if (scrollTop + clientHeight >= scrollHeight - 10) { // Allow a little buffer to trigger early
                console.log("Scrolled to the bottom");
                setOffset(prevOffset => {
                    const newOffset = prevOffset + limit;
                    fetchMoreThinks(newOffset); // 新しいオフセットを渡す
                    return newOffset; // 更新したオフセットを返す
                });
            }
        }
    };

    useEffect(() => {
        fetchMoreThinks(offset); // 最初のフェッチ時にオフセットを渡す
    }, []); // 初回マウント時のみ呼び出す

    useEffect(() => {
        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentContainer) {
                currentContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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

export default ThinkTimeline;
