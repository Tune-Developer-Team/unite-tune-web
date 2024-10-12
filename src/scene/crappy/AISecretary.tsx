import React, {useState, useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {Box, Typography, Paper, CircularProgress, TextField} from "@mui/material";
import threeDModel from "./crappy.png";
import CrappyIcon from "./CrappyIcon.png";
import SendIcon from '@mui/icons-material/Send';
import AttendanceManagement from "../../ui/AttendanceManagement";
import IconButton from "@mui/material/IconButton";

const AISecretary = () => {
    // メッセージを保持するstate
    const [messages, setMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userQuery, setUserQuery] = useState<string>(''); // ユーザーの入力を管理するstate

    useEffect(() => {
    }, []);

    // JSONに変換する前に有効なJSON形式かどうかをチェック
    function isValidJSON(jsonString: string) {
        const trimmedString = jsonString.trim();
        if (trimmedString === '') return false;

        try {
            JSON.parse(trimmedString);
            return true;
        } catch (e) {
            return false;
        }
    }

    const generateTalkBlock = (index: number, message: string, isUserMessage: boolean) => {
        return (
            <Box key={index} sx={{
                textAlign: isUserMessage ? "right" : "left",
                margin: "8px 0",
                display: "flex",
                justifyContent: isUserMessage ? "flex-end" : "flex-start"
            }}>
                {isUserMessage ?
                    <Box
                        sx={{
                            padding: "8px",
                            borderRadius: "8px",
                            backgroundColor: isUserMessage ? "#626262" : "none",
                            border: `0.2px solid ${isUserMessage ? "#838383" : "none"}`,
                            maxWidth: "70%",
                            wordWrap: "break-word",
                        }}
                    >
                        <Typography variant="body2"
                                    style={{whiteSpace: 'pre-wrap'}}>{message.replace(/^You:\s*/, '')}</Typography>
                    </Box>
                    :
                    <span>
                            <img src={CrappyIcon} alt={"icon of crappy"} width={28}/>
                            <Typography variant="body2" style={{whiteSpace: 'pre-wrap'}} sx={{paddingLeft: 3}}>
                                {message}
                            </Typography>
                        </span>
                }
            </Box>
        );
    }

    /**
     *
     * @param userQuery
     */
    const handleInputUserQuery = (userQuery: string) => {
        console.log(userQuery);
        setUserQuery(userQuery);
    }

    // ストリーミングのレスポンスを処理する関数
    const handleStreamingResponse = async () => {
        if (!userQuery) {
            console.warn("User query is empty.");
            return; // ユーザーの入力が空の場合は処理を中止
        }
        setMessages((prevMessages) => [...prevMessages, `You:${userQuery}`]); // ユーザーのメッセージを追加
        setIsLoading(true);
        const url = `${process.env.REACT_APP_DIFY_BASE_URL}/chat-messages`;
        const params = {
            inputs: {},
            query: userQuery, // ユーザーの入力をクエリとして使用
            response_mode: "streaming",
            conversation_id: "",
            user: "abc-123",
            files: [
                {
                    type: "image",
                    transfer_method: "remote_url",
                    url: "https://cloud.dify.ai/logo/logo-site.png"
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_DIFY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.body) {
                throw new Error('No response body found');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let isStreaming = true;
            while (isStreaming) {
                const {value, done} = await reader.read();
                if (done) {
                    isStreaming = false;
                } else {
                    const chunk = decoder.decode(value, {stream: true});
                    const jsonString = chunk.replace(/^data:\s*/, '');

                    // JSONが有効かどうかを確認して変換
                    if (isValidJSON(jsonString)) {
                        try {
                            const jsonData = JSON.parse(jsonString);
                            const answer = jsonData.data?.outputs?.answer;

                            if (answer) {
                                console.log(`Answer: ${answer}`);
                                setMessages((prevMessages) => [...prevMessages, `${answer}`]); // AIの応答を追加
                            } else {
                                console.log("Answer key does not exist.");
                            }
                        } catch (error) {
                            console.error("JSON parse error:", error);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Error while calling the API:", error);
        } finally {
            setIsLoading(false);
            setUserQuery(''); // リクエストが完了したら入力をリセット
        }
    };

    const [isShowModelView, setIsShowModelView] = useState(true);

    return (
        <Grid container spacing={2}>
            <span
                style={{
                    paddingLeft: 6,
                    paddingRight: 6,
                    fontSize: 12,
                    borderRadius: "8px",
                    backgroundColor: "#626262",
                    border: `0.2px solid #838383`
                }}
                onClick={() => {
                    setIsShowModelView(!isShowModelView)
                }}>
                {isShowModelView ? "hidden 3DView" : "show 3DView"}
            </span>
            <Grid xs={12} sm={12} md={12} lg={12} sx={{padding: 0, display: isShowModelView ? "block" : "none"}}>
                <img src={threeDModel} alt={"crappy-image"} width={"100%"}/>
            </Grid>

            <Grid xs={12} sm={12} md={12} lg={12} sx={{padding: 0}} position={"relative"}>
                <Box width={"100%"}
                     style={{
                         width: '100%',
                         height: '100%',
                         padding: 6,
                         minHeight: 100,
                         maxHeight: 400,
                         overflowY: 'auto',
                     }}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>

                        {messages.length === 0 && !isLoading && (
                            <Typography variant="body1" color="textSecondary">Hi, I'm Crappy ! Can I help You?</Typography>
                        )}

                        {messages.map((message, index) => (
                            generateTalkBlock(index, message, message.startsWith("You:")) // ユーザーのメッセージを判定
                        ))}

                        {isLoading && (
                            <Box sx={{textAlign: "center"}}>
                                <CircularProgress size={24}/>
                                <Typography variant="body2">Loading...</Typography>
                            </Box>
                        )}
                    </div>
                </Box>
                <Box width={"100%"} display={"flex"}
                     sx={{zIndex: 2, position: 'fixed', bottom: 60, left: 0, backgroundColor: "#2d2d2d", padding: 2}}>
                    <TextField
                        value={userQuery}
                        onChange={(e) => handleInputUserQuery(e.target.value)}
                        label="Talk with Crappy!"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline // 複数行の入力を可能にする
                        rows={1} // 表示する行数を指定（必要に応じて調整）
                    />
                    <IconButton
                        onClick={handleStreamingResponse}
                    >
                        <SendIcon/>
                    </IconButton>
                </Box>
            </Grid>

            <Grid xs={12} sm={12} md={12} lg={12}
                  sx={{paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                <AttendanceManagement/>
            </Grid>
        </Grid>
    );
};

export default AISecretary;
