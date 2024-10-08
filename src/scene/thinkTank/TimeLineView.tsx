import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {Button, Card, CardContent, CardMedia, TextField} from "@mui/material";
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
import AddThinkModal from "../../ui/addThinkModal/AddThinkModal";
import { v4 as uuidv4 } from 'uuid';

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
        await viewModel.loadTimeLine({accessToken: authState.accessToken}).then((response)=>{
            console.log(response);
        }).catch((error)=>{
            console.log(error);
        });
        setThinkList(viewModel.thinkTable.thinkList);
    }

    /**
     * Thinkの下書きの状態の監視および更新
     * @param event
     */
    const thinkDraftHandler = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const sentence = event.target.value;
        if(sentence === ''){
            setThinkDraft(null);
            return
        }
        console.log('保存準備');
        console.log(sentence);

        // TODO: 仮
        const imagePathList = [
            ImagePath.create({alt:'sample1',path:'http://hogehoge-sample1.hoge.com'}),
            ImagePath.create({alt:'sample2',path:'http://hogehoge-sample2.hoge.com'})
        ];

        // TODO:仮
        const mentionList = [
            Mention.create({idCategory: 'user', idValue:'2'}),
            Mention.create({idCategory: 'user', idValue:'3'})
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
            setThinkDraft(null);

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
        display:{xs: "block", sm: "block", md: "none", lg: "none", xl: "none"}
    }
    /**
     * PCだけ表示
     */
    const styleOfOnlyDisplayPc = {
        display:{xs: "none", sm: "none", md: "block", lg: "block", xl: "block"}
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

    useEffect( () => {
        viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }
        });

        void initThinkId();

        // タイムラインの初期化
        void loadTimeLine();

    }, []);

    return (
        <div className="TimeLine">
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid xs={12} sm={2} md={2} lg={2} >
                    <Box sx={{textAlign: "center"}}>
                    </Box>
                </Grid>
                <Grid xs={12} sm={7} md={7} lg={7} sx={{backgroundColor: "gray",height: "85vh", overflow:"auto"}}>
                    <Box sx={styleOfOnlyDisplayPc}>
                        <Box sx={{textAlign: "center", paddingBottom: 0.2}}>
                            <Card
                                sx={{'&:hover': {
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
                                                placeholder="いまの気持ちをつぶやいてみよう！"
                                                variant="outlined"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                            />
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: "100%", display:"inline-block", textAlign:"end", paddingTop:2}}>
                                        <Button onClick={addThinkButtonHandler}>
                                            投稿する
                                        </Button>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                    <Box sx={{textAlign: "center"}}>
                        {thinkList.map((think:Think, index) => (
                            <Box key={index} sx={{paddingBottom: 0.2}}>
                                <Card
                                    sx={{
                                        '&:hover': {
                                            boxShadow: 6,
                                            cursor: 'pointer',
                                            // transform: 'scale(1.01)',
                                        },
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                    }}
                                >
                                    <CardContent>
                                        <CardMedia sx={{textAlign: "start"}}>
                                            <Box sx={{display: "flex"}} onClick={()=>{console.log('この人のプロフィールへ飛ぶ')}}>
                                                <Avatar src={think.userIconImagePath} alt={'user_icon_image'}/>
                                                <Box sx={{display: "flex"}}>
                                                    <Typography sx={{alignContent: "center", paddingLeft: 1}} fontSize={20}>
                                                        {think.thinkUserName}
                                                    </Typography>
                                                    <Typography sx={{alignContent: "center", paddingLeft: 2}} color={"gray"} fontSize={14}>
                                                        {think.createdAt}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardMedia>
                                        <Box onClick={()=>{
                                            window.location.href=`/think/${think.thinkId}`
                                        }}>
                                            <Typography variant="body1" component="div">
                                                <Box sx={{paddingLeft: 2, paddingTop: 2, textAlign: "start"}}>
                                                    {think.sentence}
                                                </Box>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <Box sx={{paddingRight: 2, paddingTop: 2, textAlign: "end"}}>
                                                    {think.hashTagList.toString()}
                                                </Box>
                                            </Typography>
                                        </Box>
                                        <Box sx={{width: "100%", display:"flex"}}>
                                            <IconButton sx={{marginRight:2}} onClick={()=>{console.log('レッツクソリプ！')}}>
                                                <ReplyIcon sx={{color: "white"}}/>
                                            </IconButton>
                                            <IconButton sx={{marginRight:2}} onClick={()=>{console.log('いいね！')}}>
                                                <FavoriteIcon sx={{color: "#ff4c4c"}}/>
                                            </IconButton>
                                            <IconButton sx={{marginRight:2}} onClick={()=>{console.log('リポスト！')}}>
                                                <RepeatIcon sx={{color: "#4cffa7"}}/>
                                            </IconButton>
                                            <IconButton sx={{marginRight:2}} onClick={()=>{console.log('共有する！')}}>
                                                <IosShareIcon sx={{color: "#4cc2ff"}}/>
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={styleOfOnlyDisplaySmartPhone}>
                        <AddThinkModal/>
                    </Box>
                </Grid>
                <Grid xs={12} sm={3} md={3} lg={3}>
                    <Box sx={{textAlign: "center"}}>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default TimeLineView;
