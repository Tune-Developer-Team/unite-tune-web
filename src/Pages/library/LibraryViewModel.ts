
import Authentication from "../../models/Authentication/Authentication";
import {AuthenticationStateIF} from "../../atoms/AuthenticationState";
import {LibraryViewModelIF} from "./LibraryView";
import {UniteContentTable} from "../../models/Library/UniteContentTable";
import {UniteContentDraft} from "../../models/Library/UniteContentDraft";

export class LibraryViewModel implements LibraryViewModelIF {
    public isTopView: boolean = true;
    public uniteContentTable: UniteContentTable = UniteContentTable.initUniteContentTable();
    public uniteContentDraft: UniteContentDraft = UniteContentDraft.initUniteContentDraft();
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
    async loadUniteContent(): Promise<UniteContentTable> {
        console.log('loadTimeLine');
        // 検索条件
        const search = {
            limit: 20,
            offset:0,
            excludeReplies: "true",
            parentUniteContentId:"",
            ownerUserUid: ""
        }

        return await this.uniteContentTable.fetchUniteContentList({
            accessToken: this.authState.accessToken,
            uid: this.authState.getUid()
        }, search);
    }
}