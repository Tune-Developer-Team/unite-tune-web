import ImagePath from "../data/ImagePath";
import Mention from "../data/Mention";
import {hashTagString} from "../data/types";
import {Api} from "../Api/Api";
import {endPoint} from "../../consts/api";
import Authentication from "../Authentication/Authentication";


export interface UniteContentDraftIF {
    sentence: string
    uniteContentUserName: string
    uniteContentId: string
    curiosTags: string[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
    createdAt: string
    parentUniteContentId: string
    userIconImagePath: string
    favoriteCount: number
    repostCount: number
    isPublished: boolean
    ownerUserUid: string
}

/**
 * UniteContent下書きモデル
 */
export class UniteContentDraft {
    public uniteContentId: string
    public uniteContentUserName: string
    public userIconImagePath: string
    public favoriteCount: number
    public repostCount: number
    public createdAt: string
    public parentUniteContentId: string
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
    private constructor(argument: UniteContentDraftIF) {
        this.uniteContentId = argument.uniteContentId;
        this.uniteContentUserName = argument.uniteContentUserName;
        this.userIconImagePath = argument.userIconImagePath;
        this.favoriteCount = argument.favoriteCount;
        this.repostCount = argument.repostCount;
        this.createdAt = argument.createdAt;
        this.parentUniteContentId = argument.parentUniteContentId;
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
    public static createUniteContentDraftInstance(argument: UniteContentDraftIF
    ): UniteContentDraft {

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

        return new UniteContentDraft(argument);
    }

    /**
     * 空のシンクインスタンスを作成する
     */
    public static initUniteContentDraft(): UniteContentDraft {
        const argument: UniteContentDraftIF = {
            sentence: "",
            uniteContentUserName: "",
            uniteContentId: "",
            curiosTags: [],
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            parentUniteContentId: "",
            userIconImagePath: "",
            favoriteCount: 0,
            createdAt: "",
            repostCount: 0,
            isPublished: false,
            ownerUserUid: ""
        }

        return new UniteContentDraft(argument);
    }

    /**
     * シンクを公開用として保存する
     */
    async saveUniteContent(auth: Authentication) {
        const api = new Api(auth);

        if(auth.getUid() === "" || undefined){
            throw Error("uid is wrong.")
        }

        const uid = auth.getUid();

        const body = {
            uniteContentId: this.uniteContentId,
            uniteContentUserName: this.uniteContentUserName,
            userIconImagePath: this.userIconImagePath,
            parentUniteContentId: this.parentUniteContentId,
            sentence: this.sentence,
            curiosTagSentenceList: JSON.stringify(this.curiosTags),
            mentionList: JSON.stringify(this.mentionList),
            imagePathList: JSON.stringify(this.imagePathList),
            isPublished: this.isPublished,
            ownerUserUid: uid
        }

        return await api.post({endPoint: endPoint.THINK, body: body})
    }

    /**
     *
     * @param curiosTags
     */
    setCuriosTags(curiosTags: string[]): void {
        this.curiosTags = curiosTags;
        console.log(curiosTags)
    }

    /**
     *
     * @param text
     */
    setSentence(text: string): void {
        this.sentence = text;
    }
}