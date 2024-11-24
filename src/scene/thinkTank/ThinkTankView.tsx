import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {useRecoilState} from "recoil";
import {authenticationState, AuthenticationStateIF} from "../../atoms/AuthenticationState";
import {Think} from "../../models/ThinkTank/Think";
import {ThinkDraft} from "../../models/ThinkTank/ThinkiDraft";
import {v4 as uuidv4} from 'uuid';
import AddThinkModal from "./Parts/AddThinkModal";
import AddThinkButton from "./Parts/AddThinkButton";
import Authentication from "../../models/Authentication/Authentication";
import {ThinkTable} from "../../models/ThinkTank/ThinkTable";
import ReplyThinkModal from "./Parts/ReplyThinkMmodal";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import AddThinkFormForPC from "./Parts/AddThinkFormForPC";
import {useMediaQuery, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import {refreshTimelineState} from "../../atoms/ThinkTimelineState";
import {parentItemsState} from "../../atoms/ParentItemState";

export interface ThinkTankViewModelIF {
    isTopView: boolean;
    thinkTable: ThinkTable;
    thinkDraft: ThinkDraft;
    loadTimeLine(): Promise<ThinkTable>;
    viewInit(authState: AuthenticationStateIF): ThinkTankViewModelIF;
}

const ThinkTankView = (props:{viewModel: ThinkTankViewModelIF}) => {
    // グローバル
    const [authState] = useRecoilState(authenticationState);
    const [refreshTimeline, setRefreshTimeline] = useRecoilState(refreshTimelineState); // Use Recoil state

    // UI
    const [viewModel] = useState<ThinkTankViewModelIF>(props.viewModel.viewInit(authState));
    // const [thinkList, setThinkList] = useState<Think[]>([]);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // Determines if on desktop

    // フォーム
    const [thinkDraft, setThinkDraft] = useState<ThinkDraft>(ThinkDraft.initThinkDraft);
    const [parentThink, setParentThink] = useState<Think | null>(null);
    const [targetThink, setTargetThink] = useState<Think|null>(null)

    // アクション
    const [isReply, setIsReply] = useState<boolean>(false);
    // const [refreshTimeline, setRefreshTimeline] = useState<number>(0);
    const navigate = useNavigate();

    /**
     * 詳細を表示
     */
    useEffect(()=>{
        if (targetThink == null){
            return
        }
        navigate(`/think-tank/${targetThink.thinkId}`)
    },[targetThink]);

    /**
     * 返信処理
     * - サービス処理
     * @param parentThink
     */
    useEffect(()=>{
        console.log("リプライ")
        console.log(parentThink?.thinkId);
        if (parentThink == null){
            return
        }

        // 返信フラグ立てる
        setIsReply(true);

        // 下書きをセット
        const replyThinkDraft = ThinkDraft.initThinkDraft();
        replyThinkDraft.parentThinkId = parentThink.thinkId;
        setThinkDraft(ThinkDraft.initThinkDraft());

        // ドロワーオープン
        setIsReplyDrawerOpen(true);
    },[parentThink]);

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
    //  * タイムラインの読み込み
    //  */
    // const loadTimeLine = async (): Promise<ThinkTable | undefined> => {
    //     try {
    //         const newThinkTable = await viewModel.loadTimeLine()
    //         console.log('[try]')
    //         setThinkList(newThinkTable.thinkList);
    //         return newThinkTable;
    //     } catch (error) {
    //         console.log('[catch]')
    //         console.log(error);
    //     } finally {
    //         console.log('[finally]')
    //     }
    // }


    /**
     * 状態の初期化
     */
    const setUp = () => {
        // フォームを空にする
        setThinkDraft(ThinkDraft.initThinkDraft());
        setParentThink(null);
        setIsReply(false);
        setIsDrawerOpen(false);
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
            return
        }

        // ガード節
        if (thinkDraft.sentence === "") {
            // TODO:実装
            window.alert("本文なしなのでダメ");
            return
        }

        // 返信
        if (parentThink !== null) {
            // 返信先を指定
            thinkDraft.parentThinkId = parentThink.thinkId
        }

        // シンクIDのセット
        if (thinkDraft.thinkId === "") {
            //　新規発行
            thinkDraft.thinkId = uuidv4();
        }

        // TODO:APIの構造化
        try {
            console.log('[try]');
            console.log(thinkDraft.curiosTags)
            const response = await thinkDraft.saveThink(Authentication.fromState(authState))
            if (response === undefined) {
                throw Error
            }
            console.log('成功', response);
            //　状態の初期化
            setUp();

            // 状態の更新を行い、子コンポーネントの再レンダリングをトリガー
            setRefreshTimeline(true);
        } catch (e) {
            console.log('[catch]');
            console.log('失敗', e);
        } finally {
            console.log('[finally]');
        }
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);

    const openAddThinkModalHandler = () => {
        console.log('[click]openAddThinkModalHandler')

        setThinkDraft(ThinkDraft.initThinkDraft());
        // ドロワーオープン
        setIsDrawerOpen(true);
    }

    const closeDrawerHandler = () => {
        console.log('[click]closeDrawerHandler')
        // 状態の初期化
        setParentThink(null);
        setThinkDraft(ThinkDraft.initThinkDraft());
        // 返信用
        setIsReply(false);
        setParentThink(null);

        // ドロワークローズ
        setIsDrawerOpen(false);
        setIsReplyDrawerOpen(false);
    }

    const onChangeDraftHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, thinkDraft: ThinkDraft): ThinkDraft => {
        console.log("こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！");
        // 必要に応じてthinkDraftを処理するロジックをここに追加してください
        console.log(thinkDraft.sentence);
        return thinkDraft;
    }

    return (
        <Grid sx={{paddingTop: {md: 6, lg: 6, xl: 6}}} container spacing={2} padding={0}>
            {/*トップタブ*/}
            {/*{viewModel.isTopView ? <CustomTabs tabItems={viewModel.tabItems} bottomTab={'ThinkTank'}/> : ""}*/}
            {/*シンク投稿モーダル*/}
            <AddThinkModal
                isOpen={isDrawerOpen}
                onClose={closeDrawerHandler}
                onSubmit={addThinkButtonHandler}
                thinkDraft={thinkDraft}
                onDraftChange={onChangeDraftHandler}
            />
            {/*リプライ投稿モーダル*/}
            {parentThink !== null ?
                <ReplyThinkModal
                    isOpen={isReplyDrawerOpen}
                    onClose={closeDrawerHandler}
                    onSubmit={addThinkButtonHandler}
                    parentThink={parentThink}
                    thinkDraft={thinkDraft}
                    onDraftChange={onChangeDraftHandler}
                /> : ""}
            {/*スマホ用UI*/}
            {!isDesktop && (
                <>
                    {/* タイムライン,詳細 */}
                    <Outlet context={{targetThink, setTargetThink, setParentThink, refreshTimeline}}/>
                    <AddThinkButton onClick={openAddThinkModalHandler}/>
                </>
            )}
            {/*PC用UI*/}
            {isDesktop && (
                <Box display={"flex"} width={"100%"}>
                    <AddThinkFormForPC
                        onSubmit={addThinkButtonHandler}
                        thinkDraft={thinkDraft}
                        onDraftChange={onChangeDraftHandler}
                    />
                        {/* タイムライン,詳細 */}
                        <Outlet context={{targetThink, setTargetThink, setParentThink}}/>
                </Box>
            )}
        </Grid>
    );
};

export default ThinkTankView;
