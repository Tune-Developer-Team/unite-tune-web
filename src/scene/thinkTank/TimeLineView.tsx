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
import IconButton from "@mui/material/IconButton";
import {Think} from "../../models/ThinkTank/Think";
import {TimeLineViewModel} from "./TimeLineViewModel";
import {ThinkDraft, ThinkDraftIF} from "../../models/ThinkTank/ThinkiDraft";
import ImagePath from "../../models/data/ImagePath";
import Mention from "../../models/data/Mention";
import {v4 as uuidv4} from 'uuid';
import AddIcon from '@mui/icons-material/Add';

const timeLineViewModel = new TimeLineViewModel();

const TimeLineView = () => {
    const [profile] = useRecoilState(profileState);
    const [authState] = useRecoilState(authenticationState);
    const [viewModel] = useState<TimeLineViewModel>(timeLineViewModel);
    const [thinkList, setThinkList] = useState<Think[]>([]);
    const [thinkDraft, setThinkDraft] = useState<ThinkDraft | null>(null);
    const [thinkId, setThinkId] = useState<string>("")
    const [isPublished, setIsPublished] = useState<boolean>(false)

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
            hashTagList: ['#abc', '#efg', '#hij'],
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
        if (thinkDraft === null) {
            return
        }

        console.log(thinkDraft);

        const response = await viewModel.saveThink(thinkDraft).then((response) => {
            console.log('成功', response);

            // フォームを空にする
            setThinkDraft(ThinkDraft.initThinkDraft());

            // ThinkId初期化
            void initThinkId();

            // タイムラインの更新
            void loadTimeLine();

            return response;
        }).catch((error) => {
            console.log('失敗', error);
            return error;
        });
        console.log(response);
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

    const [isOpenThinkModal, setIsOpenThinkModal] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openAddThinkModalHandler = () => {
        console.log('push addThink button');
        // setIsOpenThinkModal(true);
        setIsDrawerOpen(true);
    }

    const closeAddThinkModalHandler = () => {
        console.log('push addThink button');
        // setIsOpenThinkModal(false);
        setIsDrawerOpen(true);
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const toggleDrawer = (open: boolean) => {
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
                                            placeholder="いまの気持ちをつぶやいてみよう！"
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
                    <Box sx={{position: "relative"}}>
                        <Fab sx={{position:"fixed", bottom: 100, right: 40}} color="primary" aria-label="add" onClick={() => openAddThinkModalHandler()}>
                            <AddIcon/>
                        </Fab>
                    </Box>
                    <Drawer
                        anchor="bottom"
                        open={isDrawerOpen}
                        onClose={() => toggleDrawer(false)}
                        sx={{
                            '& .MuiDrawer-paper': {
                                padding: 2,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                backgroundColor: "#000000"
                            }
                        }}
                    >
                        <Box sx={{width: 'auto', padding: 2}}>
                            <Box display={"flex"}>
                                <Box width={"100%"}>
                                    <Typography color={"#ffffff"} onClick={() => {
                                        toggleDrawer(false)
                                    }}
                                                sx={{float: 'start', font: 'bold'}}>
                                        キャンセル
                                    </Typography>
                                </Box>
                                <Box width={"100%"}>
                                    <Typography color={"#496cff"} sx={{float: 'right', font: 'bold'}}
                                                onClick={() => {
                                                    addThinkButtonHandler();
                                                    setIsDrawerOpen(false);
                                                }}
                                    >
                                        つぶやく
                                    </Typography>
                                </Box>
                            </Box>
                            <Box paddingTop={4}>
                                <Typography variant="body1" component="div">
                                    <TextField
                                        onChange={(e) => thinkDraftHandler(e)}
                                        id="add-think-text-field"
                                        multiline
                                        rows={20}
                                        value={thinkDraft?.sentence ?? ""}
                                        placeholder="いまの気持ちをつぶやいてみよう！"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                    />
                                </Typography>
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
                                            console.log('この人のプロフィールへ飛ぶ')
                                        }}>
                                            <Box sx={{display: "flex"}}>
                                                <Avatar src={think.userIconImagePath} alt={'user_icon_image'}/>
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
                                    <Box onClick={() => {
                                        window.location.href = `/think/${think.thinkId}`
                                    }}>
                                        <Typography variant="body1" component="div">
                                            <Box sx={{paddingLeft: 2, paddingTop: 2, textAlign: "start"}}>
                                                {think.sentence}
                                            </Box>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <Box sx={{paddingRight: 2, textAlign: "end"}}>
                                                {think.hashTagList}
                                            </Box>
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: "100%", display: "flex"}} padding={0}>
                                        <ReplyIcon sx={{color: "white", width:18, marginRight:3}} onClick={() => {
                                            console.log('レッツクソリプ！')
                                        }}/>
                                        <FavoriteIcon sx={{color: "#ff4c4c", width:18, marginRight:3}} onClick={() => {
                                            console.log('いいね！')
                                        }}/>
                                        <RepeatIcon sx={{color: "#4cffa7", width:18, marginRight:3}} onClick={() => {
                                            console.log('リポスト！')
                                        }}/>
                                        <IosShareIcon sx={{color: "#4cc2ff", width:18, marginRight:3}} onClick={() => {
                                            console.log('共有する！')
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
