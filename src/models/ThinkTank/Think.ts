import ImagePath from "../data/ImagePath";
import Mention from "../data/Mention";
import {hashTagString} from "../data/types";

export interface ThinkIF {
    sentence: string
    thinkUserName: string
    ownerUserUid: string
    thinkId: string
    hashTagList: hashTagString[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
    createdAt: string
    parentThinkId: string
    userIconImagePath: ImagePath
    favoriteCount: number
    repostCount: number
}

/**
 * Thinkモデル
 */
export class Think {
    public thinkId: string
    public thinkUserName: string
    public ownerUserUid: string
    public userIconImagePath: ImagePath
    public favoriteCount: number
    public repostCount: number
    public createdAt: Date
    public parentThinkId: string
    public sentence: string
    public hashTagList: hashTagString[]
    public mentionList: Mention[]
    public imagePathList: ImagePath[]

    /**
     * コンストラクタ
     * @param argument
     */
    constructor(argument: ThinkIF) {

        const createdAt = new Date(argument.createdAt)

        this.thinkId = argument.thinkId;
        this.thinkUserName = argument.thinkUserName;
        this.ownerUserUid = argument.ownerUserUid;
        this.userIconImagePath = argument.userIconImagePath;
        this.favoriteCount = argument.favoriteCount;
        this.repostCount = argument.repostCount;
        this.createdAt = createdAt;
        this.parentThinkId = argument.parentThinkId
        this.sentence = argument.sentence;
        this.hashTagList = argument.hashTagList;
        this.mentionList = argument.mentionList;
        this.imagePathList = argument.imagePathList
    }

    /**
     * ファクトリメソッド
     */
    public static createThinkInstance(argument: ThinkIF
    ): Think {

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

        return new Think(argument);
    }

    /**
     * TODO:実装
     */
    public toggleFavorite() {
    }

    /**
     * TODO:実装
     */
    public toggleRepost() {
    }

    /**
     * TODO:実装
     */
    public shareThink() {
    }
}