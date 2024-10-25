import {ThinkTable} from "../../models/ThinkTank/ThinkTable";
import {ThinkDraft} from "../../models/ThinkTank/ThinkiDraft";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {TimeLineViewModelIF} from "./TimeLineViewModelIF";
import {TabItem} from "../../ui/layout/CustomTabs";

export class TimeLineViewModel implements TimeLineViewModelIF {
    public thinkTable: ThinkTable = ThinkTable.initThinkTable();
    public thinkDraft: ThinkDraft = ThinkDraft.initThinkDraft();
    public tabItems: TabItem[] = [
        {label: 'All'},
        {label: 'Curios'},
        {label: 'Tech'},
        {label: 'General'}
    ];
    private readonly authState: Authentication;
    constructor(state: AuthenticationArgumentIF) {
        this.authState = Authentication.fromState(state);
    }

    /**
     * セットアップ処理
     * @param argument
     */
    async setUp(argument: { authentication: AuthenticationArgumentIF }): Promise<{ updateCount: number } | void> {
        console.log('====================TimeLineViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);

        console.log('====================TimeLineViewModel_setup_end====================');
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('TimeLineViewModel');
        console.log('cleanUp');
    }


    /**
     * Thinkを投稿する
     */
    public async saveThink(thinkDraft: ThinkDraft) {

        if (thinkDraft.thinkId === "") {
            return
        }
        return await thinkDraft.saveThink(this.authState);
    };

    /**
     * タイムラインを読み込む
     */
    async loadTimeLine(): Promise<ThinkTable> {
        console.log('loadTimeLine');
        return await this.thinkTable.fetchThinkList({
            accessToken: this.authState.accessToken,
            uid: this.authState.getUid()
        });
    }

    /**
     * TODO:実装
     */
    shareThink(): void {
    }

    /**
     * TODO:実装
     */
    toggleFavorite(): void {
    }

    /**
     * TODO:実装
     */
    toggleRepost(): void {
    }
}