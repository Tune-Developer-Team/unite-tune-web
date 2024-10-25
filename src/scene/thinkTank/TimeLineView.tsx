import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {Think} from "../../models/ThinkTank/Think";
import {TimeLineViewModel} from "./TimeLineViewModel";
import {ThinkDraft} from "../../models/ThinkTank/ThinkiDraft";
import CustomTabs from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import {v4 as uuidv4} from 'uuid';
import ThinkTimeline from "./Parts/ThinkTimeline";
import AddThinkModal from "./Parts/AddThinkModal";
import AddThinkButton from "./Parts/AddThinkButton";
import Authentication from "../../models/Authentication/Authentication";

const TimeLineView = () => {
    // グローバル
    const [authState] = useRecoilState(authenticationState);

    // UI
    const [viewModel] = useState<TimeLineViewModel>(new TimeLineViewModel(authState));
    const [thinkList, setThinkList] = useState<Think[]>([]);

    // フォーム
    const [thinkDraft, setThinkDraft] = useState<ThinkDraft>(ThinkDraft.initThinkDraft);
    const [parentThink, setParentThink] = useState<Think | null>(null);

    // アクション
    const [isReply, setIsReply] = useState<boolean>(false);

    const generatePlaceholder = (): string => {
        const to = parentThink?.thinkUserName ?? "";
        return isReply ? `${to}さんへ返信しよう` : "いまの気持ちをつぶやいてみよう！";
    }

    /**
     * 返信処理
     * - サービス処理
     * @param parentThink
     */
    const onClickHandleReply = async (parentThink: Think) => {
        setIsReply(true);
        setParentThink(parentThink);
        await addThinkButtonHandler()
    }

    /**
     * いいね処理
     * - サービス処理
     * @param think
     */
    const onClickHandleFavorite = (think: Think) => {
        console.log("API_Favorite", think);
        window.alert("ごめんまだ開発中");
    }

    /**
     * リシンク処理
     * - サービス処理
     * @param think
     */
    const onClickHandleRethink = (think: Think) => {
        console.log("API_Rethink", think);
        window.alert("ごめんまだ開発中");
    }

    /**
     * シェア処理
     * - サービス処理
     * @param think
     */
    const onClickHandleShare = (think: Think) => {
        console.log("share", think);
        window.alert("ごめんまだ開発中");
    }

    // /**
    //  * ThinkIdをリセットする
    //  */
    // const initThinkId = () => {
    //     const newThinkId = uuidv4();
    //     setThinkId(newThinkId)
    // }

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
     * 状態の初期化
     */
    const setUp = () => {
        // フォームを空にする
        setThinkDraft(ThinkDraft.initThinkDraft());
        setParentThink(null);
        setIsReply(false);

        // タイムラインの更新
        void loadTimeLine();
    }

    /**
     * シンクの投稿をおこなう
     */
    const addThinkButtonHandler = async (): Promise<void> => {
        console.log('[addThinkButtonHandler]');
        // ガード節
        if (thinkDraft === null) {
            // TODO:実装
            window.alert("入力なしなのでダメ");
            //　状態の初期化
            setUp();
            return
        }

        // ガード節
        if (thinkDraft.sentence == "") {
            // TODO:実装
            window.alert("本文なしなのでダメ");
            //　状態の初期化
            setUp();
            return
        }

        // 返信
        if (parentThink !== null) {
            // 返信先を指定
            thinkDraft.parentThinkId = parentThink.thinkId

            // TODO:実装
            window.alert("ごめんまだ開発中");
            //　状態の初期化
            setUp();
            return
        }

        // シンクIDのセット
        if (thinkDraft.thinkId === "") {
            //　新規発行
            thinkDraft.thinkId = uuidv4();
        }

        // TODO:APIの構造化
        try {
            console.log('[try]');
            const response = await thinkDraft.saveThink(Authentication.fromState(authState))
            if (response === undefined) {
                throw Error
            }
            console.log('成功', response);
            //　状態の初期化
            setUp();
        } catch (e) {
            console.log('[catch]');
            console.log('失敗', e);
        } finally {
            console.log('[finally]');
        }
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openAddThinkModalHandler = () => {
        console.log('[click]openAddThinkModalHandler')

        setThinkDraft(ThinkDraft.initThinkDraft());
        // ドロワーオープン
        setIsDrawerOpen(true);
    }

    const closeDrawerHandler = () => {
        console.log('[click]closeDrawerHandler')
        setParentThink(null);
        setIsReply(false);
        setThinkDraft(ThinkDraft.initThinkDraft());

        // ドロワークローズ
        setIsDrawerOpen(false);
    }

    const onChangeDraftHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, thinkDraft: ThinkDraft): ThinkDraft => {
        console.log("こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！");
        // 必要に応じてthinkDraftを処理するロジックをここに追加してください
        console.log(thinkDraft.sentence);
        return thinkDraft;
    }

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

        if (!strictModeIgnore) {
            // タイムラインの初期化
            void loadTimeLine();
        }

        return () => {
            strictModeIgnore = true;
        };
    }, []);

    return (
        <Grid container spacing={2} padding={0}>
            <CustomTabs tabItems={viewModel.tabItems} bottomTab={'ThinkTank'}/>
            <AddThinkButton onClick={openAddThinkModalHandler} />
            <AddThinkModal
                isOpen={isDrawerOpen}
                onClose={closeDrawerHandler}
                onSubmit={addThinkButtonHandler}
                thinkDraft={thinkDraft}
                onDraftChange={onChangeDraftHandler}
            />
            <ThinkTimeline
                thinkList={thinkList}
                onClickReplyHandler={onClickHandleReply}
                onClickFavoriteHandler={onClickHandleFavorite}
                onClickRethinkHandler={onClickHandleRethink}
                onClickShareHandler={onClickHandleShare}
            />
        </Grid>
    );
};

export default TimeLineView;
