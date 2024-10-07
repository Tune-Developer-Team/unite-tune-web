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
    hashTagList: hashTagString[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
    createdAt: string
    parentThinkId: string
    userIconImagePath: string
    favoriteCount: number
    repostCount: number
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
    public hashTagList: hashTagString[]
    public mentionList: Mention[]
    public imagePathList: ImagePath[]

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
        this.hashTagList = argument.hashTagList;
        this.mentionList = argument.mentionList;
        this.imagePathList = argument.imagePathList;
    }

    /**
     * ファクトリメソッド
     * @param argument
     */
    public static createThinkDraftInstance(argument: ThinkDraftIF
    ): ThinkDraft {

        if (argument.hashTagList === null) {
            argument.hashTagList = [];
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
            hashTagList: ["#a,#b"],
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            parentThinkId: "",
            userIconImagePath: "",
            favoriteCount: 0,
            createdAt: "",
            repostCount: 0,
        }

        return new ThinkDraft(argument);
    }

    /**
     * シンクを公開用として保存する
     */
    async saveThink(auth: Authentication) {
        const api = new Api(auth);
        return await api.post({endPoint: endPoint.THINK, body: this})
    }
}