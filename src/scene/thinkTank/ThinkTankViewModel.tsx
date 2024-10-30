import {ThinkTable} from "../../models/ThinkTank/ThinkTable";
import {ThinkDraft} from "../../models/ThinkTank/ThinkiDraft";
import Authentication from "../../models/Authentication/Authentication";
import {TabItem} from "../../ui/layout/CustomTabs";
import {ThinkTankViewModelIF} from "./ThinkTankView";
import {AuthenticationStateIF} from "../../atoms/AuthenticationState";

export class ThinkTankViewModel implements ThinkTankViewModelIF {
    public isTopView: boolean = true;
    public thinkTable: ThinkTable = ThinkTable.initThinkTable();
    public thinkDraft: ThinkDraft = ThinkDraft.initThinkDraft();
    public tabItems: TabItem[] = [
        {label: 'All'},
        {label: 'Curios'},
        {label: 'Tech'},
        {label: 'General'}
    ];
    private readonly authState: Authentication;
    private constructor(state: AuthenticationStateIF) {
        this.authState = Authentication.fromState(state);
    }

    static appInit(): ThinkTankViewModelIF {
        const emptyState: AuthenticationStateIF = {accessToken: "", email: "", uid: ""};
        return new ThinkTankViewModel(emptyState);
    }

    viewInit(authState: AuthenticationStateIF): ThinkTankViewModelIF {
        return new ThinkTankViewModel(authState);
    }

    /**
     * タイムラインを読み込む
     */
    async loadTimeLine(): Promise<ThinkTable> {
        console.log('loadTimeLine');
        // 検索条件
        const search = {
            limit: 20,
            offset:0,
            excludeReplies: "true",
            parentThinkId:"",
            ownerUserUid: ""
        }

        return await this.thinkTable.fetchThinkList({
            accessToken: this.authState.accessToken,
            uid: this.authState.getUid()
        }, search);
    }

}