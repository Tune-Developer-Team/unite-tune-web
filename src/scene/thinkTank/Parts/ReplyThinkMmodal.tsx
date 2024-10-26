// AddThinkModal.tsx
import React, {useEffect, useState} from 'react';
import { Drawer, Box, Typography, TextField, Avatar } from '@mui/material';
import {ThinkDraft} from "../../../models/ThinkTank/ThinkiDraft";
import CuriosTagInput from "../../../ui/curiosTag/CuriosTagInput";
import {Think} from "../../../models/ThinkTank/Think";
import replyBar from './replyBar.svg'
import {useRecoilState} from "recoil";
import {profileState} from "../../../atoms/ProfileState";
import {red} from "@mui/material/colors";

interface ReplyThinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    thinkDraft: ThinkDraft;
    parentThink: Think;
    onDraftChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, thinkDraft: ThinkDraft) => ThinkDraft;
}

const ReplyThinkModal: React.FC<ReplyThinkModalProps> = ({ isOpen, onClose, onSubmit, thinkDraft, parentThink, onDraftChange }) => {
    const [myProfile] = useRecoilState(profileState)
    const [sentence, setSentence] = useState<string>("");
    const [curiosTags, setCuriosTags] = useState<string[]>([]);

    // UI
    const [isNeedImportCuriosTags, setIsNeedImportCuriosTags] = useState<boolean>(true);
    const [onClickCuriosTagImportButtonColor, setOnClickCuriosTagImportButtonColor] = useState<string>('#2BA129FF');

    /**
     * セットアップ処理
     */
    useEffect(() => {
        console.log('[set-up]AddThinkModal')
        initForm();
    }, [thinkDraft])

    /**
     * フォームの初期化
     */
    const initForm = () => {
        setSentence("");
        setCuriosTags([]);
    }

    /**
     * イベント処理
     * - サービス処理
     * - UIの描画
     * - モデルのデータ更新
     * @param e
     */
    const onChangeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log('[event]onChangeHandler')
        const newSentence = e.target.value;
        // サービス処理
        // TODO: 入力された文字列を解析してサジェストする処理,ハッシュタグの推測など

        //　UIの描画
        setSentence(newSentence);

        //　モデルのデータ更新
        thinkDraft.setSentence(newSentence);
        onDraftChange(e, thinkDraft);
    }

    /**
     * 他コンポーネン経由のデータの更新
     */
    useEffect(() => {
        thinkDraft.setCuriosTags(curiosTags);
    }, [curiosTags]);

    /**
     * サービス処理
     * - ボタンアクション
     * - キュリオスタグのインポート
     */
    const onClickCuriosTagImportButtonHandler = () => {
        if (!isNeedImportCuriosTags) {
            window.alert('キュリオスタグは引き継ぎ済みです。');
        }

        thinkDraft.setCuriosTags(parentThink.curiosTags);
        setCuriosTags(parentThink.curiosTags);

        setIsNeedImportCuriosTags(false);
        setOnClickCuriosTagImportButtonColor('#586383FF')
    };

    const generatePlaceholder = (): string => {
        const to = parentThink?.thinkUserName ?? "";
        return `${to}さんへ返信しよう.まだ開発中だけど好きに触ってみて！`;
    }

    return (
        <Drawer
            anchor="bottom"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    padding: 2,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: "#000000",
                    animation: 'slideUp 0.3s ease-in-out',
                    height: '90vh',
                    maxHeight: '98vh',
                    overflowY: 'auto'
                },
                '@keyframes slideUp': {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: "auto"}}>
                <Box display="flex" position="sticky" top={10} zIndex={10}>
                    <Typography color="#ffffff" onClick={onClose} sx={{ font: 'bold' }}>キャンセル</Typography>
                    <Typography color="#496cff" onClick={onSubmit} sx={{ font: 'bold', marginLeft: 'auto' }}>つぶやく</Typography>
                </Box>
                <Box display="flex" paddingBottom={0.5} paddingTop={4}>
                    <Avatar src={parentThink.userIconImagePath.path} alt={'user_icon_image'}/>
                    <Typography sx={{ alignContent: "center", paddingLeft: 1 }} fontSize={14}>{parentThink.thinkUserName}</Typography>
                </Box>
                <Box padding={0} sx={{ display: 'flex', height: 'auto', flexGrow: 1 }}>
                    <Box className="replyBar" sx={{ flex: '0 0 auto', height: '100%' }} paddingTop={0} paddingRight={0.5}>
                        {/* 縦方向にグラデーションがかかる縦棒 */}
                        <Box
                            marginLeft={1.5}
                            marginTop={-2}
                            sx={{
                                background: 'linear-gradient(to bottom, #1E61D7FF, #586383FF)',
                                width: 3,  // 幅を指定
                                height: '100%',  // 画面いっぱいに広げる
                                flex: '0 0 auto',
                            }}
                        />
                        <Box
                            onClick={onClickCuriosTagImportButtonHandler}
                            marginLeft={0.8}
                            sx={{
                                backgroundColor: onClickCuriosTagImportButtonColor,
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: '0 0 auto',
                                animation: isNeedImportCuriosTags ? 'blink 1s infinite' : 'none',  // 点滅アニメーションの適用
                                '@keyframes blink': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.6 }, // 中間で薄くなる
                                    '100%': { opacity: 1 }, // フェードイン
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ flex: '1 1 auto', overflowWrap: 'break-word', maxHeight: '100%' }}>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            textAlign={"start"}
                            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            dangerouslySetInnerHTML={{ __html: parentThink.getSentenceWithHtml() }}
                        />
                        <span>{parentThink.curiosTags.map((tag, index) => {
                            return (
                                <Typography key={index} color="text.secondary" display={"inline-flex"} sx={{ flexWrap: 'wrap', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                    &nbsp;{tag}
                                </Typography>
                            )
                        })}</span>
                    </Box>
                </Box>
                <Box sx={{ display: "flex"}} paddingTop={2}>
                    <Typography textAlign={"center"} paddingTop={1} paddingRight={1}>
                        Reply by
                    </Typography>
                    <Box display={"inline-flex"} height={30} width={30}>
                        <Avatar src={myProfile.iconImage.path} alt={'user_icon_image'} style={{ height: "100%", width: "100%" }}/>
                    </Box>
                </Box>
                <TextField
                    style={{paddingTop:6}}
                    onChange={onChangeHandler}
                    multiline
                    value={sentence}
                    placeholder={generatePlaceholder()}
                    variant="outlined"
                    fullWidth
                    minRows={15}
                    maxRows={40}
                    sx={{ flexGrow: 1, resize: 'vertical', overflow: 'auto', paddingTop: 4 }}
                />
                <CuriosTagInput tags={curiosTags} setTags={setCuriosTags} />
            </Box>
        </Drawer>
    );
};

export default ReplyThinkModal;
