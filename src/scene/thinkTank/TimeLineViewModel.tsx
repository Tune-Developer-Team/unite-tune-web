import {ThinkTable} from "../../models/ThinkTank/ThinkTable";
import {ThinkDraft} from "../../models/ThinkTank/ThinkiDraft";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {Think} from "../../models/ThinkTank/Think";
import {TimeLineViewModelIF} from "./TimeLineViewModelIF";

export class TimeLineViewModel implements TimeLineViewModelIF {
    public authState:Authentication;
    public thinkTable: ThinkTable = ThinkTable.initThinkTable();
    public thinkDraft: ThinkDraft = ThinkDraft.initThinkDraft();
    constructor(
    ) {
        this.authState = Authentication.initAuthentication();
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
    public async saveThink() {

        if (this.thinkDraft.thinkId !== "") {
            return
        }
        return await this.thinkDraft.saveThink(this.authState);
    };

    /**
     * タイムラインを読み込む
     * @param props
     */
    async loadTimeLine(props: { accessToken: string }): Promise<{
        result: { updateCount: number } | void,
        ThinkList: Think[]
    }> {
        console.log('loadTimeLine');
        const result = await this.thinkTable.fetchThinkList({
            accessToken: this.authState.getAccessToken(),
            uid: this.authState.getUid()
        });

        console.log(result);

        return {
            result: result,
            ThinkList: this.thinkTable.thinkList
        };
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