import ImagePath from "../data/ImagePath";
import Mention from "../data/Mention";
import {convertNewlinesToBreaks, convertTextToLinks} from "../../util/htmlTools";
import {format} from "util";
import axios, {AxiosResponse} from "axios";
import {endPoint} from "../../consts/api";
import {FetchTimeLineSearchIF, UniteContentApiResponseIF} from "./UniteContentTable";
import {AuthenticationStateIF} from "../../atoms/AuthenticationState";

export interface UniteContentIF {
    sentence: string
    uniteContentUserName: string
    ownerUserUid: string
    uniteContentId: string
    curiosTags: string[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
    createdAt: string
    parentUniteContentId: string
    userIconImagePath: ImagePath
    favoriteCount: number
    repostCount: number
    hasReply: boolean
}

/**
 * UniteContentモデル
 */
export class UniteContent {
    public uniteContentId: string
    public uniteContentUserName: string
    public ownerUserUid: string
    public userIconImagePath: ImagePath
    public favoriteCount: number
    public repostCount: number
    public createdAt: Date
    public parentUniteContentId: string
    public sentence: string
    public curiosTags: string[]
    public mentionList: Mention[]
    public imagePathList: ImagePath[]
    public hasReply: boolean

    /**
     * コンストラクタ
     * @param argument
     */
    constructor(argument: UniteContentIF) {

        // console.log('===============================')
        // console.log(argument.createdAt)
        // console.log('===============================')

        const createdAt = new Date(argument.createdAt);

        this.uniteContentId = argument.uniteContentId;
        this.uniteContentUserName = argument.uniteContentUserName;
        this.ownerUserUid = argument.ownerUserUid;
        this.userIconImagePath = argument.userIconImagePath;
        this.favoriteCount = argument.favoriteCount;
        this.repostCount = argument.repostCount;
        this.createdAt = createdAt;
        this.parentUniteContentId = argument.parentUniteContentId
        this.sentence = argument.sentence;
        this.curiosTags = argument.curiosTags;
        this.mentionList = argument.mentionList;
        this.imagePathList = argument.imagePathList
        this.hasReply = argument.hasReply
    }

    static initUniteContent() {
        const argument: UniteContentIF = {
            sentence: "",
            uniteContentUserName: "",
            ownerUserUid: "",
            uniteContentId: "",
            curiosTags: [],
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            createdAt: "",
            parentUniteContentId: "",
            userIconImagePath: ImagePath.create({alt:"",path:""}),
            favoriteCount: 0,
            repostCount: 0,
            hasReply: false,
        }

        return new UniteContent(argument);
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
    public static createUniteContentInstance(argument: UniteContentIF
    ): UniteContent {

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

        return new UniteContent(argument);
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
    public shareUniteContent() {
    }

    /**
     * 詳細画面のエンティティを取得する
     * @param auth
     */
    public async fetchUniteContentDetail(auth:　AuthenticationStateIF): Promise<UniteContent> {
        // シンクを取得する
        const accessToken = auth.accessToken as string;
        const axiosInstance = axios.create({
            headers: {
                'Authorization': accessToken
            }
        });

        try {
            const response = await axiosInstance.get(`${endPoint.THINK_DETAIL}/${this.uniteContentId}`);
            console.log(response.data);
            return this.createdUniteContentByAPIResponse(response);
        } catch (error) {
            console.log(error);
            return UniteContent.initUniteContent();
        }
    }

    private createdUniteContentByAPIResponse(response: AxiosResponse): UniteContent {
        console.log("createdUniteContentListByAPIResponse")
        console.log(response.data.data)

        const apiResponse: UniteContentApiResponseIF = response.data.data
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

        const uniteContentArgument: UniteContentIF = {
            sentence: apiResponse.sentence,
            uniteContentUserName: apiResponse.uniteContentUserName,
            userIconImagePath: ownerUserIconImagePath,
            ownerUserUid: apiResponse.ownerUserUid,
            // imagePathList: apiResponse.ImagePathList,
            imagePathList: [ImagePath.create({alt: "", path: ""})],
            uniteContentId: apiResponse.uniteContentId,
            curiosTags: curiosTags,
            // mentionList: apiResponse.MentionList,
            mentionList: [Mention.create({idValue: "", idCategory: ""})],
            createdAt: apiResponse.createdAt,
            parentUniteContentId: apiResponse.parentUniteContentId,
            favoriteCount: 0,
            repostCount: apiResponse.reuniteContentCount,
            hasReply: apiResponse.hasReply,
        }

        return UniteContent.createUniteContentInstance(uniteContentArgument);
    }
}