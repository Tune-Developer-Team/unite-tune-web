import {TabItem} from "../../../ui/layout/CustomTabs";
import {ThinkDraft} from "../../../models/ThinkTank/ThinkiDraft";
import Authentication, {AuthenticationArgumentIF} from "../../../models/Authentication/Authentication";
import {ThinkTankViewModelIF} from "../../thinkTank/ThinkTankView";
import {FetchTimeLineSearchIF, ThinkTable} from "../../../models/ThinkTank/ThinkTable";
import {AuthenticationStateIF} from "../../../atoms/AuthenticationState";

export class MyThinkTankViewModel implements ThinkTankViewModelIF {
    public isTopView: boolean = false;
    public tabItems: TabItem[] = [];
    public thinkTable: ThinkTable = ThinkTable.initThinkTable();
    public thinkDraft: ThinkDraft = ThinkDraft.initThinkDraft();
    private readonly authState: Authentication;

    private constructor(state: AuthenticationStateIF) {
        this.authState = Authentication.fromState(state);
    }

    static appInit(): ThinkTankViewModelIF {
        const emptyState: AuthenticationStateIF = {accessToken: "", email: "", uid: ""};
        return new MyThinkTankViewModel(emptyState);
    }

    viewInit(authState: AuthenticationStateIF): ThinkTankViewModelIF {
        return new MyThinkTankViewModel(authState);
    }
    /**
     * タイムラインを読み込む
     */
    async loadTimeLine(): Promise<ThinkTable> {

        // 検索条件
        const search: FetchTimeLineSearchIF = {
            limit: 20,
            offset: 0,
            excludeReplies: "false",
            parentThinkId: "",
            ownerUserUid: this.authState.getUid()
        }

        return await this.thinkTable.fetchThinkList({
            accessToken: this.authState.accessToken,
            uid: this.authState.getUid()
        },search);
    }

}