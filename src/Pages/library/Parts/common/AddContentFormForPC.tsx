// AddContentModal.tsx
import React, {useEffect, useState} from 'react';
import {Box, TextField, Button} from '@mui/material';
import CuriosTagInput from "../../../../ui/curiosTag/CuriosTagInput";
import {UniteContentDraft} from "../../../../models/Library/UniteContentDraft";

interface AddUniteContentFormForPCProps {
    onSubmit: () => void;
    uniteContentDraft: UniteContentDraft;
    onDraftChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, uniteContentDraft: UniteContentDraft) => UniteContentDraft;
}

const AddContentFormForPC: React.FC<AddUniteContentFormForPCProps> = ({ onSubmit, uniteContentDraft, onDraftChange }) => {
    const [sentence, setSentence] = useState<string>("");
    const [curiosTags, setCuriosTags] = useState<string[]>([]);

    /**
     * セットアップ処理
     */
    useEffect(() => {
        console.log('[set-up]AddContentModal')
        initForm();
    }, [uniteContentDraft])

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
        uniteContentDraft.setSentence(newSentence);
        onDraftChange(e, uniteContentDraft);
    }

    /**
     * 他コンポーネン経由のデータの更新
     */
    useEffect(() => {
        uniteContentDraft.setCuriosTags(curiosTags);
    }, [curiosTags]);


    return (
            <Box sx={{ paddingTop: 0, padding: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <TextField
                    onChange={onChangeHandler}
                    multiline
                    value={sentence}
                    placeholder="ここは自由な場所です。思ったことはなんでも気軽に書こう。"
                    variant="outlined"
                    fullWidth
                    minRows={3}
                    maxRows={40}
                    sx={{ flexGrow: 1, resize: 'vertical', overflow: 'auto', paddingTop: 4 }}
                />
                <CuriosTagInput tags={curiosTags} setTags={setCuriosTags} />
                <Box display="flex" position="sticky" top={10} zIndex={10}>
                    <Button onClick={onSubmit} sx={{
                        font: 'bold', marginLeft: 'auto',
                        color: 'white', // ボタンのテキストカラーを白に設定
                        backgroundColor: '#1c3cda',
                        '&:hover': {
                            backgroundColor: '#6174da' // ホバー時の背景色を少し変える
                        },
                    }}
                    >
                        つぶやく
                    </Button>
                    {/*<Typography color="#496cff" ></Typography>*/}
                </Box>
            </Box>
    );
};

export default AddContentFormForPC;
