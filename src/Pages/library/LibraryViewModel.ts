import {ThinkTable} from "../../models/ThinkTank/ThinkTable";
import {ThinkDraft} from "../../models/ThinkTank/ThinkiDraft";
import Authentication from "../../models/Authentication/Authentication";
import {AuthenticationStateIF} from "../../atoms/AuthenticationState";
import {LibraryViewModelIF} from "./LibraryView";

export class LibraryViewModel implements LibraryViewModelIF {
    public isTopView: boolean = true;
    public thinkTable: ThinkTable = ThinkTable.initThinkTable();
    public thinkDraft: ThinkDraft = ThinkDraft.initThinkDraft();
    // public tabItems: TabItem[] = [
    //     {label: 'All'},
    //     {label: 'Curios'},
    //     {label: 'Tech'},
    //     {label: 'General'}
    // ];
    private readonly authState: Authentication;
    private constructor(state: AuthenticationStateIF) {
        this.authState = Authentication.fromState(state);
    }

    static appInit(): LibraryViewModelIF {
        const emptyState: AuthenticationStateIF = {accessToken: "", email: "", uid: ""};
        return new LibraryViewModel(emptyState);
    }

    viewInit(authState: AuthenticationStateIF): LibraryViewModelIF {
        return new LibraryViewModel(authState);
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