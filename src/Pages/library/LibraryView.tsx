import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {useRecoilState} from "recoil";
import {authenticationState, AuthenticationStateIF} from "../../atoms/AuthenticationState";
import RoundedButton from "../../ui/button/RoundedButton";
import AddContentFormForPC from "./Parts/common/AddContentFormForPC";
import {UniteContentTable} from "../../models/Library/UniteContentTable";
import {UniteContentDraft} from "../../models/Library/UniteContentDraft";
import {UniteContent} from "../../models/Library/UniteContent";
import AddContentModal from "./Parts/common/AddContentModal";
import {Box, Button, useMediaQuery, useTheme} from "@mui/material";
import {refreshTimelineState} from "../../atoms/ThinkTimelineState";
import Authentication from "../../models/Authentication/Authentication";
import {Outlet, useNavigate} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {v4 as uuidv4} from 'uuid';

export interface LibraryViewModelIF {
    isTopView: boolean;
    uniteContentTable: UniteContentTable;
    uniteContentDraft: UniteContentDraft;
    loadUniteContent(): Promise<UniteContentTable>;
    viewInit(authState: AuthenticationStateIF): LibraryViewModelIF;
}

const LibraryView = (props:{viewModel: LibraryViewModelIF}) => {
    // グローバル
    const [authState] = useRecoilState(authenticationState);
    const [refreshTimeline, setRefreshTimeline] = useRecoilState(refreshTimelineState); // Use Recoil state

    // UI
    const [viewModel] = useState<LibraryViewModelIF>(props.viewModel.viewInit(authState));
    // const [uniteContentList, setUniteContentList] = useState<UniteContent[]>([]);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // Determines if on desktop

    // フォーム
    const [uniteContentDraft, setUniteContentDraft] = useState<UniteContentDraft>(UniteContentDraft.initUniteContentDraft);
    const [parentUniteContent, setParentUniteContent] = useState<UniteContent | null>(null);
    const [targetUniteContent, setTargetUniteContent] = useState<UniteContent|null>(null)

    // アクション
    const [isReply, setIsReply] = useState<boolean>(false);
    // const [refreshTimeline, setRefreshTimeline] = useState<number>(0);
    const navigate = useNavigate();

    /**
     * 詳細を表示
     */
    useEffect(()=>{
        if (targetUniteContent == null){
            return
        }
        navigate(`/uniteContent-tank/${targetUniteContent.uniteContentId}`)
    },[targetUniteContent]);

    /**
     * 返信処理
     * - サービス処理
     * @param parentUniteContent
     */
    useEffect(()=>{
        console.log("リプライ")
        console.log(parentUniteContent?.uniteContentId);
        if (parentUniteContent == null){
            return
        }

        // 返信フラグ立てる
        setIsReply(true);

        // 下書きをセット
        const replyUniteContentDraft = UniteContentDraft.initUniteContentDraft();
        replyUniteContentDraft.parentUniteContentId = parentUniteContent.uniteContentId;
        setUniteContentDraft(UniteContentDraft.initUniteContentDraft());

        // ドロワーオープン
        setIsReplyDrawerOpen(true);
    },[parentUniteContent]);

    /**
     * いいね処理
     * - サービス処理
     * @param uniteContent
     */
    const onClickHandleFavorite = (uniteContent: UniteContent) => {
        console.log("API_Favorite", uniteContent);
        window.alert("ごめんまだ開発中");
    }

    /**
     * ユナイトコンテンツ処理
     * - サービス処理
     * @param uniteContent
     */
    const onClickHandleReuniteContent = (uniteContent: UniteContent) => {
        console.log("API_ReuniteContent", uniteContent);
        window.alert("ごめんまだ開発中");
    }

    /**
     * シェア処理
     * - サービス処理
     * @param uniteContent
     */
    const onClickHandleShare = (uniteContent: UniteContent) => {
        console.log("share", uniteContent);
        window.alert("ごめんまだ開発中");
    }

    // /**
    //  * タイムラインの読み込み
    //  */
    // const loadTimeLine = async (): Promise<UniteContentTable | undefined> => {
    //     try {
    //         const newUniteContentTable = await viewModel.loadTimeLine()
    //         console.log('[try]')
    //         setUniteContentList(newUniteContentTable.uniteContentList);
    //         return newUniteContentTable;
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
        setUniteContentDraft(UniteContentDraft.initUniteContentDraft());
        setParentUniteContent(null);
        setIsReply(false);
        setIsDrawerOpen(false);
    }

    /**
     *  ユナイトコンテンツの投稿をおこなう
     */
    const addUniteContentButtonHandler = async (): Promise<void> => {
        console.log('[addUniteContentButtonHandler]');
        // ガード節
        if (uniteContentDraft === null) {
            // TODO:実装
            window.alert("入力なしなのでダメ");
            return
        }

        // ガード節
        if (uniteContentDraft.sentence === "") {
            // TODO:実装
            window.alert("本文なしなのでダメ");
            return
        }

        // 返信
        if (parentUniteContent !== null) {
            // 返信先を指定
            uniteContentDraft.parentUniteContentId = parentUniteContent.uniteContentId
        }

        //  ユナイトコンテンツIDのセット
        if (uniteContentDraft.uniteContentId === "") {
            //　新規発行
            uniteContentDraft.uniteContentId = uuidv4();
        }

        // TODO:APIの構造化
        try {
            console.log('[try]');
            console.log(uniteContentDraft.curiosTags)
            const response = await uniteContentDraft.saveUniteContent(Authentication.fromState(authState))
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

    const openAddUniteContentModalHandler = () => {
        console.log('[click]openAddUniteContentModalHandler')

        setUniteContentDraft(UniteContentDraft.initUniteContentDraft());
        // ドロワーオープン
        setIsDrawerOpen(true);
    }

    const closeDrawerHandler = () => {
        console.log('[click]closeDrawerHandler')
        // 状態の初期化
        setParentUniteContent(null);
        setUniteContentDraft(UniteContentDraft.initUniteContentDraft());
        // 返信用
        setIsReply(false);
        setParentUniteContent(null);

        // ドロワークローズ
        setIsDrawerOpen(false);
        setIsReplyDrawerOpen(false);
    }

    const onChangeDraftHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, uniteContentDraft: UniteContentDraft): UniteContentDraft => {
        console.log("こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！");
        // 必要に応じてuniteContentDraftを処理するロジックをここに追加してください
        console.log(uniteContentDraft.sentence);
        return uniteContentDraft;
    }

    return (
        <Grid sx={{paddingTop: {md: 6, lg: 6, xl: 6}}} container spacing={2} padding={0}>
            {/* ユナイトコンテンツ投稿モーダル*/}
            <AddContentModal
                isOpen={isDrawerOpen}
                onClose={closeDrawerHandler}
                onSubmit={addUniteContentButtonHandler}
                uniteContentDraft={uniteContentDraft}
                onDraftChange={onChangeDraftHandler}
            />
            {/*詳細画面*/}
                <Box>
                    {/*{parentUniteContent !== null ?*/}
                    {/*    <ReplyUniteContentModal*/}
                    {/*        isOpen={isReplyDrawerOpen}*/}
                    {/*        onClose={closeDrawerHandler}*/}
                    {/*        onSubmit={addUniteContentButtonHandler}*/}
                    {/*        parentUniteContent={parentUniteContent}*/}
                    {/*        uniteContentDraft={uniteContentDraft}*/}
                    {/*        onDraftChange={onChangeDraftHandler}*/}
                    {/*    />*/}
                    {/*    : ""}*/}
                </Box>
            {/*スマホ用UI*/}
            {!isDesktop && (
                <>
                    {/* タイムライン,詳細 */}
                    <Outlet context={{targetUniteContent, setTargetUniteContent, setParentUniteContent, refreshTimeline}}/>
                    {/*<AddContent onClick={openAddUniteContentModalHandler}/>*/}
                </>
            )}
            {/*PC用UI*/}
            {isDesktop && (
                <Box display={"flex"} width={"100%"}>
                    <AddContentFormForPC
                        onSubmit={addUniteContentButtonHandler}
                        uniteContentDraft={uniteContentDraft}
                        onDraftChange={onChangeDraftHandler}
                    />
                    {/* タイムライン,詳細 */}
                    <Outlet context={{targetUniteContent, setTargetUniteContent, setParentUniteContent}}/>
                </Box>
            )}
        </Grid>
    );
};

export default LibraryView;
