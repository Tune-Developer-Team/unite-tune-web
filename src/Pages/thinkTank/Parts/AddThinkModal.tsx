// AddContentModal.tsx
import React, {useEffect, useState} from 'react';
import { Drawer, Box, Typography, TextField, Avatar } from '@mui/material';
import {ThinkDraft} from "../../../models/ThinkTank/ThinkiDraft";
import CuriosTagInput from "../../../ui/curiosTag/CuriosTagInput";

interface AddThinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    thinkDraft: ThinkDraft;
    onDraftChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, thinkDraft: ThinkDraft) => ThinkDraft;
}

const AddThinkModal: React.FC<AddThinkModalProps> = ({ isOpen, onClose, onSubmit, thinkDraft, onDraftChange }) => {
    const [sentence, setSentence] = useState<string>("");
    const [facets, setFacets] = useState<string[]>([]);

    /**
     * セットアップ処理
     */
    useEffect(() => {
        console.log('[set-up]AddContentModal')
        initForm();
    }, [thinkDraft])

    /**
     * フォームの初期化
     */
    const initForm = () => {
        setSentence("");
        setFacets([]);
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
        thinkDraft.setFacets(facets);
    }, [facets]);


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
            <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box display="flex" position="sticky" top={10} zIndex={10}>
                    <Typography color="#ffffff" onClick={onClose} sx={{ font: 'bold' }}>キャンセル</Typography>
                    <Typography color="#496cff" onClick={onSubmit} sx={{ font: 'bold', marginLeft: 'auto' }}>つぶやく</Typography>
                </Box>
                <TextField
                    onChange={onChangeHandler}
                    multiline
                    value={sentence}
                    placeholder="ここは自由な場所です。思ったことはなんでも気軽に書こう。"
                    variant="outlined"
                    fullWidth
                    minRows={15}
                    maxRows={40}
                    sx={{ flexGrow: 1, resize: 'vertical', overflow: 'auto', paddingTop: 4 }}
                />
                <CuriosTagInput tags={facets} setTags={setFacets} />
            </Box>
        </Drawer>
    );
};

export default AddThinkModal;
