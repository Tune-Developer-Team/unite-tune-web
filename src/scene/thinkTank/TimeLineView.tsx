import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {Button, Card, CardContent, CardMedia, Drawer, Fab, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import Avatar from "@mui/material/Avatar";
import IosShareIcon from '@mui/icons-material/IosShare';
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import {Think} from "../../models/ThinkTank/Think";
import {TimeLineViewModel} from "./TimeLineViewModel";
import {ThinkDraft, ThinkDraftIF} from "../../models/ThinkTank/ThinkiDraft";
import ImagePath from "../../models/data/ImagePath";
import Mention from "../../models/data/Mention";
import {v4 as uuidv4} from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import CustomTabs from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import {useNavigate} from "react-router-dom";
import replyBar from "./replyBar.svg"
import CuriosTagInput from "../../ui/curiosTag/CuriosTagInput";

const timeLineViewModel = new TimeLineViewModel();

const TimeLineView = () => {
    // グローバル
    const [profile] = useRecoilState(profileState);
    const [authState] = useRecoilState(authenticationState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);

    // UI
    const [viewModel] = useState<TimeLineViewModel>(timeLineViewModel);
    const [thinkList, setThinkList] = useState<Think[]>([]);

    // フォーム
    const [thinkDraft, setThinkDraft] = useState<ThinkDraft | null>(null);
    const [thinkId, setThinkId] = useState<string>("")
    const [isPublished, setIsPublished] = useState<boolean>(false)
    const [newTags, setNewTags] = useState<string[]>([]);
    const navigate = useNavigate();
    const [parentThink, setParentThink] = useState<Think|null>(null);

    // アクション
    const [isReply, setIsReply] = useState<boolean>(false);

    const handleReply = async (parentThink: Think) => {
        setIsReply(true);
        setParentThink(parentThink);
        await addThinkButtonHandler()
    }

    const handleFavorite = (think:Think) => {
        console.log("API_Favorite", think);
        window.alert("ごめんまだ開発中");
    }

    const handleRethink = (think:Think) => {
        console.log("API_Rethink", think);
        window.alert("ごめんまだ開発中");
    }

    const handleShare = (think: Think) => {
        console.log("share", think);
        window.alert("ごめんまだ開発中");
    }

    /**
     * ThinkIdをリセットする
     */
    const initThinkId = () => {
        const newThinkId = uuidv4();
        setThinkId(newThinkId)
    }

    /**
     * タイムラインの読み込み
     */
    const loadTimeLine = async (): Promise<void> => {
        await viewModel.loadTimeLine().then((newThinkTable) => {
            setThinkList(newThinkTable.thinkList.reverse());
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * Thinkの下書きの状態の監視および更新
     * @param event
     */
    const thinkDraftHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const sentence = event.target.value;
        if (sentence === '') {
            setThinkDraft(null);
            return
        }
        console.log('保存準備');
        console.log(sentence);

        // TODO: 仮
        const imagePathList = [
            ImagePath.create({alt: 'sample1', path: 'http://hogehoge-sample1.hoge.com'}),
            ImagePath.create({alt: 'sample2', path: 'http://hogehoge-sample2.hoge.com'})
        ];

        // TODO:仮
        const mentionList = [
            Mention.create({idCategory: 'user', idValue: '2'}),
            Mention.create({idCategory: 'user', idValue: '3'})
        ];

        const argument: ThinkDraftIF = {
            createdAt: "",
            favoriteCount: 0,
            imagePathList: imagePathList,
            repostCount: 0,
            thinkId: thinkId,
            thinkUserName: "",
            userIconImagePath: "",
            sentence: sentence,
            curiosTags: [],
            mentionList: mentionList,
            parentThinkId: '',
            isPublished: isPublished,
            ownerUserUid: authState.uid
        }

        const draft = ThinkDraft.createThinkDraftInstance(argument)

        console.log(draft);
        setThinkDraft(draft);
    }

    /**
     * シンクの投稿をおこなう
     */
    const addThinkButtonHandler = async (): Promise<void> => {

        // ガード節
        if (thinkDraft === null) {
            window.alert("入力なしなのでダメ");
            //　状態の初期化
            initState();
            return
        }
        if(thinkDraft.sentence == "") {
            window.alert("本文なしなのでダメ");
            //　状態の初期化
            initState();
            return
        }

        if (parentThink !== null) {
            thinkDraft.parentThinkId = parentThink.thinkId
            window.alert("ごめんまだ開発中");
            //　状態の初期化
            initState();
            return
        }

        // キュリオスタグをセット
        thinkDraft.curiosTags = newTags;

        const response = await viewModel.saveThink(thinkDraft).then((response) => {

            if (response === undefined) {
                throw Error
            }

            console.log('成功', response);

            //　状態の初期化
            initState();

            return response;
        }).catch((error) => {
            console.log('失敗', error);
            return error;
        });
        console.log(response);
    }

    /**
     * 状態の初期化
     */
    const initState = ()=> {
        // フォームを空にする
        setThinkDraft(ThinkDraft.initThinkDraft());
        setParentThink(null);
        setIsReply(false);

        // ThinkId初期化
        void initThinkId();

        // タイムラインの更新
        void loadTimeLine();
    }

    /**
     * スマホだけ表示
     */
    const styleOfOnlyDisplaySmartPhone = {
        display: {xs: "block", sm: "block", md: "none", lg: "none", xl: "none"}
    }
    /**
     * PCだけ表示
     */
    const styleOfOnlyDisplayPc = {
        display: {xs: "none", sm: "none", md: "block", lg: "block", xl: "block"}
    }

    /**
     * 下書きの入力エリア
     */
    const styleAddThinkTextFillArea = {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 2,
        textAlign: "start"
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openAddThinkModalHandler = () => {
        console.log('push addThink button');

        setIsDrawerOpen(true);
    }

    const generatePlaceholder = ():string => {
        const to = parentThink?.thinkUserName??"";
        return isReply ? `${to}さんへ返信しよう` : "いまの気持ちをつぶやいてみよう！";

    }

    const toggleDrawer = (open: boolean) => {
        setParentThink(null);
        setIsReply(false);
        setIsDrawerOpen(open);
    };

    // 開発環境においてStrictModeの2回目を無視するフラグ
    let strictModeIgnore = false;
    useEffect(() => {
        viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }
        });

        void initThinkId();

        if (!strictModeIgnore) {
            // タイムラインの初期化
            void loadTimeLine();
        }

        return () => {
            strictModeIgnore = true;
        };
    }, []);

    return (
        <Grid container spacing={2}>
            <CustomTabs tabItems={viewModel.tabItems} bottomTab={'ThinkTank'}/>
            <Grid padding={0} xs={12} sm={12} md={7} lg={7} sx={{height: "85vh", overflow: "auto"}}>
                <Box sx={styleOfOnlyDisplayPc} width={"100%"}>
                    <Box sx={{textAlign: "center", paddingBottom: 0.5}}>
                        <Card
                            sx={{
                                '&:hover': {
                                    boxShadow: 6,
                                    cursor: 'pointer',
                                    // transform: 'scale(1.05)',
                                },
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                        >
                            <CardContent>
                                <CardMedia sx={{textAlign: "start"}}>
                                    <Box sx={{display: "flex"}}>
                                        <Avatar src={profile.iconImage} alt={profile.nickName}/>
                                        <Typography sx={{alignContent: "center", paddingLeft: 1}}>
                                            {profile.nickName}
                                        </Typography>
                                    </Box>
                                </CardMedia>
                                <Box sx={styleAddThinkTextFillArea}>
                                    <Typography variant="body1" component="div">
                                        <TextField
                                            onChange={(e) => thinkDraftHandler(e)}
                                            id="add-think-text-field"
                                            multiline
                                            rows={4}
                                            value={thinkDraft?.sentence ?? ""}
                                            placeholder={generatePlaceholder()}
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                        />
                                    </Typography>
                                </Box>
                                <Box sx={{width: "100%", display: "inline-block", textAlign: "end", paddingTop: 2}}>
                                    <Button onClick={addThinkButtonHandler}>
                                        投稿する
                                    </Button>
                                </Box>

                            </CardContent>
                        </Card>
                    </Box>
                </Box>
                <Box sx={styleOfOnlyDisplaySmartPhone}>
                    <Box sx={{ position: "relative" }}>
                        <Fab
                            sx={{ position: "fixed", bottom: 100, right: 40 }}
                            color="primary"
                            aria-label="add"
                            onClick={() => openAddThinkModalHandler()}
                        >
                            <AddIcon />
                        </Fab>
                    </Box>
                    <Drawer
                        anchor="bottom" // 下から出現するようにする
                        open={isDrawerOpen}
                        onClose={() => toggleDrawer(false)}
                        sx={{
                            '& .MuiDrawer-paper': {
                                padding: 2,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                backgroundColor: "#000000",
                                animation: 'slideUp 0.3s ease-in-out', // 下から出現するアニメーション
                                height: '98vh', // デフォルトの高さを設定
                                maxHeight: '98vh',
                                overflowY: 'auto'
                            },
                            '@keyframes slideUp': { // 下から上にスライドするアニメーション定義
                                '0%': {
                                    transform: 'translateY(100%)',
                                },
                                '100%': {
                                    transform: 'translateY(0)',
                                },
                            }
                        }}
                    >
                        <Box sx={{ width: 'auto', padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box display={"flex"} position="sticky" top={0} zIndex={10}>
                                <Box width={"100%"}>
                                    <Typography
                                        color={"#ffffff"}
                                        onClick={() => toggleDrawer(false)}
                                        sx={{ float: 'start', font: 'bold' }}
                                    >
                                        キャンセル
                                    </Typography>
                                </Box>
                                <Box width={"100%"}>
                                    <Typography
                                        color={"#496cff"}
                                        sx={{ float: 'right', font: 'bold' }}
                                        onClick={() => {
                                            addThinkButtonHandler();
                                            setIsDrawerOpen(false);
                                        }}
                                    >
                                        つぶやく
                                    </Typography>
                                </Box>
                            </Box>
                            {/* TextFieldを含むボックスを余白なしで表示させる */}
                            <Box sx={{paddingTop: 4, flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                                {parentThink !== null ?
                                    <Box sx={{display: isReply ? "block" : "none"}} padding={0}>
                                        <Typography variant="body1" color="text.primary" textAlign={"start"}
                                                    dangerouslySetInnerHTML={{__html: parentThink.getSentenceWithHtml()}}
                                        />
                                        <span>{parentThink.curiosTags.map((tag, index) => {
                                            return (
                                                <Typography color="text.secondary" display={"inline-flex"}>
                                                    {tag}
                                                </Typography>
                                            )
                                        })
                                        }</span>
                                        <Box sx={{display: "flex"}} paddingBottom={1} paddingTop={1}>
                                            <img src={replyBar} alt={"replyBar"} height={60} width={10}/>
                                            <Box paddingTop={1} paddingLeft={2} display={"flex"} height={10}>
                                                <Avatar src={parentThink.userIconImagePath.path} alt={'user_icon_image'}/>
                                                <Typography textAlign={"center"} paddingTop={1}>
                                                    さんへの返信
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    : ""
                                }
                                <TextField
                                    onChange={(e) => thinkDraftHandler(e)}
                                    id="add-think-text-field"
                                    multiline
                                    value={thinkDraft?.sentence ?? ""}
                                    placeholder={generatePlaceholder()}
                                    variant="outlined"
                                    fullWidth
                                    minRows={15}
                                    maxRows={40}
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    sx={{
                                        flexGrow: 1, // 親のボックス全体に広がるようにする
                                        resize: 'vertical', // ユーザーが高さを変更できるようにする
                                        overflow: 'auto',
                                    }}
                                />
                                <CuriosTagInput tags={newTags} setTags={setNewTags} />
                            </Box>
                        </Box>
                    </Drawer>
                </Box>

                <Box sx={{textAlign: "center"}}>
                    {thinkList.map((think: Think, index) => (
                        <Box key={index} sx={{paddingBottom: 0.2}}>
                            <Card
                                sx={{
                                    padding:0,
                                    '&:hover': {
                                        boxShadow: 6,
                                        cursor: 'pointer',
                                        // transform: 'scale(1.01)',
                                    },
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                }}
                            >
                                <CardContent sx={{paddingTop: 2}}>
                                    <CardMedia sx={{textAlign: "start"}}>
                                        <Box sx={{display: "flex",  padding:0}} onClick={() => {
                                            navigate(`/user/${think.ownerUserUid}`)
                                        }}>
                                            <Box sx={{display: "flex"}}>
                                                <Avatar src={think.userIconImagePath.path} alt={'user_icon_image'}/>
                                                <Typography sx={{alignContent: "center", paddingLeft: 1}} fontSize={12}>
                                                    {think.thinkUserName}
                                                </Typography>
                                                <Typography sx={{alignContent: "center", paddingLeft: 2}} color={"gray"}
                                                            fontSize={10}>
                                                    {think.createdAt.toDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardMedia>
                                    <Box paddingTop={2}>
                                        <Typography variant="body1" color="text.primary" textAlign={"start"}
                                                    dangerouslySetInnerHTML={{__html: think.getSentenceWithHtml()}}
                                        />
                                        <Typography variant="body2" color="text.secondary" textAlign={"start"}>
                                            {think.curiosTags.map((tag, index) => {
                                                return (
                                                    <Typography display={"inline-flex"}>
                                                        {tag}
                                                    </Typography>
                                                )
                                            })
                                            }
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: "100%", display: "flex"}} padding={0}>
                                        <ReplyIcon sx={{color: "white", width: 18, marginRight: 3}}
                                                   onClick={() => {
                                                       setIsReply(true);
                                                       setParentThink(think);
                                                       openAddThinkModalHandler();
                                                   }}/>
                                        <FavoriteIcon
                                            sx={{
                                                // color: think.isFavorite ? "#ff4c4c" : "white",
                                                width: 18, marginRight: 3}}
                                            onClick={() => {
                                                handleFavorite(think);
                                            }}/>
                                        <RepeatIcon
                                            sx={{
                                                // color: think.isRethink ? "#4cffa7" : "white",
                                                width: 18, marginRight: 3}}
                                            onClick={() => {
                                                handleRethink(think);
                                            }}/>
                                        <IosShareIcon sx={{width: 18, marginRight: 3}} onClick={() => {
                                            handleShare(think);
                                        }}/>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Grid>
            <Grid xs={12} sm={3} md={3} lg={3}>
                <Box sx={{textAlign: "center"}}>
                </Box>
            </Grid>
        </Grid>
    );
};

export default TimeLineView;
