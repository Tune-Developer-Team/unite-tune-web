import ImagePath from "../data/ImagePath";
import Mention from "../data/Mention";
import {hashTagString} from "../data/types";
import {Api} from "../Api/Api";
import {endPoint} from "../../consts/api";
import Authentication from "../Authentication/Authentication";


export interface ThinkDraftIF {
    sentence: string
    thinkUserName: string
    thinkId: string
    curiosTags: string[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
    createdAt: string
    parentThinkId: string
    userIconImagePath: string
    favoriteCount: number
    repostCount: number
    isPublished: boolean
    ownerUserUid: string
}

/**
 * Think下書きモデル
 */
export class ThinkDraft {
    public thinkId: string
    public thinkUserName: string
    public userIconImagePath: string
    public favoriteCount: number
    public repostCount: number
    public createdAt: string
    public parentThinkId: string
    public sentence: string
    public curiosTags: string[]
    public mentionList: Mention[]
    public imagePathList: ImagePath[]
    public isPublished: boolean
    public ownerUserUid: string

    /**
     * コンストラクタ
     * @param argument
     */
    private constructor(argument: ThinkDraftIF) {
        this.thinkId = argument.thinkId;
        this.thinkUserName = argument.thinkUserName;
        this.userIconImagePath = argument.userIconImagePath;
        this.favoriteCount = argument.favoriteCount;
        this.repostCount = argument.repostCount;
        this.createdAt = argument.createdAt;
        this.parentThinkId = argument.parentThinkId;
        this.sentence = argument.sentence;
        this.curiosTags = argument.curiosTags;
        this.mentionList = argument.mentionList;
        this.imagePathList = argument.imagePathList;
        this.isPublished = argument.isPublished;
        this.ownerUserUid = argument.ownerUserUid;
    }

    /**
     * ファクトリメソッド
     * @param argument
     */
    public static createThinkDraftInstance(argument: ThinkDraftIF
    ): ThinkDraft {

        if (argument.curiosTags === null) {
            argument.curiosTags = [];
        }

        if (argument.imagePathList === null) {
            argument.imagePathList = [];
        }

        if (argument.mentionList === null) {
            argument.mentionList = [];
        }

        if (argument.sentence === '') {
            console.log('error')
        }

        return new ThinkDraft(argument);
    }

    /**
     * 空のシンクインスタンスを作成する
     */
    public static initThinkDraft(): ThinkDraft {
        const argument: ThinkDraftIF = {
            sentence: "",
            thinkUserName: "",
            thinkId: "",
            curiosTags: [],
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            parentThinkId: "",
            userIconImagePath: "",
            favoriteCount: 0,
            createdAt: "",
            repostCount: 0,
            isPublished: false,
            ownerUserUid: ""
        }

        return new ThinkDraft(argument);
    }

    /**
     * シンクを公開用として保存する
     */
    async saveThink(auth: Authentication) {
        const api = new Api(auth);

        if(auth.getUid() === "" || undefined){
            throw Error("uid is wrong.")
        }

        const uid = auth.getUid();

        const body = {
            thinkId: this.thinkId,
            thinkUserName: this.thinkUserName,
            userIconImagePath: this.userIconImagePath,
            parentThinkId: this.parentThinkId,
            sentence: this.sentence,
            curiosTagSentenceList: JSON.stringify(this.curiosTags),
            mentionList: JSON.stringify(this.mentionList),
            imagePathList: JSON.stringify(this.imagePathList),
            isPublished: this.isPublished,
            ownerUserUid: uid
        }

        return await api.post({endPoint: endPoint.THINK, body: body})
    }
}