import ImagePath from "../data/ImagePath";
import Mention from "../data/Mention";
import {convertNewlinesToBreaks, convertTextToLinks} from "../../util/htmlTools";
import {format} from "util";
import axios, {AxiosResponse} from "axios";
import {endPoint} from "../../consts/api";
import {FetchTimeLineSearchIF, ThinkApiResponseIF} from "./ThinkTable";
import {AuthenticationStateIF} from "../../atoms/AuthenticationState";

export interface ThinkIF {
    sentence: string
    thinkUserName: string
    ownerUserUid: string
    thinkId: string
    curiosTags: string[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
    createdAt: string
    parentThinkId: string
    userIconImagePath: ImagePath
    favoriteCount: number
    repostCount: number
    hasReply: boolean
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
    public curiosTags: string[]
    public mentionList: Mention[]
    public imagePathList: ImagePath[]
    public hasReply: boolean

    /**
     * コンストラクタ
     * @param argument
     */
    constructor(argument: ThinkIF) {

        // console.log('===============================')
        // console.log(argument.createdAt)
        // console.log('===============================')

        const createdAt = new Date(argument.createdAt);

        this.thinkId = argument.thinkId;
        this.thinkUserName = argument.thinkUserName;
        this.ownerUserUid = argument.ownerUserUid;
        this.userIconImagePath = argument.userIconImagePath;
        this.favoriteCount = argument.favoriteCount;
        this.repostCount = argument.repostCount;
        this.createdAt = createdAt;
        this.parentThinkId = argument.parentThinkId
        this.sentence = argument.sentence;
        this.curiosTags = argument.curiosTags;
        this.mentionList = argument.mentionList;
        this.imagePathList = argument.imagePathList
        this.hasReply = argument.hasReply
    }

    static initThink() {
        const argument: ThinkIF = {
            sentence: "",
            thinkUserName: "",
            ownerUserUid: "",
            thinkId: "",
            curiosTags: [],
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            createdAt: "",
            parentThinkId: "",
            userIconImagePath: ImagePath.create({alt:"",path:""}),
            favoriteCount: 0,
            repostCount: 0,
            hasReply: false,
        }

        return new Think(argument);
    }


    /**
     *
     */
    public getSentenceWithHtml(){
        let sentence = convertTextToLinks(this.sentence);
        sentence = convertNewlinesToBreaks(sentence);
        return sentence
    }

    /**
     *
     */
    public getTimeFormattedStamp(){
        const dateTime = new Date(this.createdAt);
        return format(dateTime, 'yyyy-MM-dd HH:mm').replace('GMT+0900 (日本標準時) \'yyyy-MM-dd HH:mm\'', '');
    }

    /**
     * ファクトリメソッド
     */
    public static createThinkInstance(argument: ThinkIF
    ): Think {

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

    /**
     * 詳細画面のエンティティを取得する
     * @param auth
     */
    public async fetchThinkDetail(auth:　AuthenticationStateIF): Promise<Think> {
        // シンクを取得する
        const accessToken = auth.accessToken as string;
        const axiosInstance = axios.create({
            headers: {
                'Authorization': accessToken
            }
        });

        try {
            const response = await axiosInstance.get(`${endPoint.THINK_DETAIL}/${this.thinkId}`);
            console.log(response.data);
            return this.createdThinkByAPIResponse(response);
        } catch (error) {
            console.log(error);
            return Think.initThink();
        }
    }

    private createdThinkByAPIResponse(response: AxiosResponse): Think {
        console.log("createdThinkListByAPIResponse")
        console.log(response.data.data)

        const apiResponse: ThinkApiResponseIF = response.data.data
        // オーナーユーザーのアイコン
        let ownerUserIconImagePath = ImagePath.create({path: "", alt: ""});
        if (apiResponse.userIconImagePath !== "") {
            const ownerUserIconJson = JSON.parse(apiResponse.userIconImagePath)
            ownerUserIconImagePath.alt = ownerUserIconJson.alt;
            ownerUserIconImagePath.path = ownerUserIconJson.path;
        }

        // キュリオスタグ
        console.log(apiResponse.curiosTags)
        let curiosTags: string[] = [];
        if (apiResponse.curiosTags !== "") {
            curiosTags = Array.from(
                new Set(
                    apiResponse.curiosTags
                        .split(',')
                        .map(tag => tag.trim()) // 空白を取り除く
                        .filter(tag => tag && tag !== '#') // 空文字や # のみを除外
                )
            );
        }

        const thinkArgument: ThinkIF = {
            sentence: apiResponse.sentence,
            thinkUserName: apiResponse.thinkUserName,
            userIconImagePath: ownerUserIconImagePath,
            ownerUserUid: apiResponse.ownerUserUid,
            // imagePathList: apiResponse.ImagePathList,
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            thinkId: apiResponse.thinkId,
            curiosTags: curiosTags,
            // mentionList: apiResponse.MentionList,
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            createdAt: apiResponse.createdAt,
            parentThinkId: apiResponse.parentThinkId,
            favoriteCount: 0,
            repostCount: apiResponse.rethinkCount,
            hasReply: apiResponse.hasReply,
        }

        return Think.createThinkInstance(thinkArgument);
    }
}