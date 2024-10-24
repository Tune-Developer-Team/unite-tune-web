/**
 * Seed詳細モデル
 */

import dayjs from "dayjs";
import {Api} from "../Api/Api";
import {endPoint} from "../../consts/api";
import Authentication from "../Authentication/Authentication";
import {hashTagString} from "../data/types";
import Mention from "../data/Mention";
import ImagePath from "../data/ImagePath";

export interface QuestDetailIF {
    questId: string
    ownerUserUid: string
    ownerUserName: string
    isPublished: boolean
    updatedAt: string
    title: string
    description: string
    benefit: string
    termsFrom: string
    termsTo: string
    relationQuestIdList: string[]
    hashTagStringList: string[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
}

export interface QuestDetailApiResponseIF {
    ID: number
    ImagePathList: string;
    TermsFrom: string;
    TermsTo: string;
    Description: string;
    RelationQuestIdList: string[];
    Title: string;
    MentionList: Mention[];
    Benefit: string;
    HashTagList: string;
    QuestId: string
    OwnerUserUid: string
    OwnerUserName: string
    IsPublished: boolean
    UpdatedAt: string
}

export class QuestDetail {
    public questId: string
    public ownerUserUid: string
    public ownerUserName: string
    public isPublished: boolean
    public updatedAt: string
    public title: string
    public description: string
    public benefit: string
    public termsFrom: string
    public termsTo: string
    public relationQuestIdList: string[]
    public hashTagStringList: string[]
    public imagePathList: ImagePath[]
    public mentionList: Mention[]

    /**
     * コンストラクタ
     * @param input
     */
    private constructor(input: QuestDetailIF) {
        this.questId = input.questId;
        this.ownerUserUid = input.ownerUserUid;
        this.ownerUserName = input.ownerUserName;
        this.isPublished = input.isPublished;
        this.updatedAt = input.updatedAt;
        this.title = input.title;
        this.description = input.description;
        this.benefit = input.benefit;
        this.termsFrom = input.termsFrom;
        this.termsTo = input.termsTo;
        this.relationQuestIdList = input.relationQuestIdList;
        this.hashTagStringList = input.hashTagStringList;
        this.imagePathList = input.imagePathList;
        this.mentionList = input.mentionList;
    }

    async fetchModel(questId: string, auth: Authentication): Promise<QuestDetail> {
        const api = new Api(auth);
        return await api.get(`${endPoint.SEED}/${questId}`).then((res)=>{
            return this.setFromAPIResponse(res.data.data);
        }).catch((err)=>{
            const newModel = QuestDetail.initQuestDetail();
            newModel.isPublished = false;
            newModel.ownerUserUid = auth.getUid();
            return newModel;
        });
    }

    async setFromAPIResponse(apiResponse: QuestDetailApiResponseIF): Promise<QuestDetail> {

        const imagePathJson = JSON.parse(apiResponse.ImagePathList)
        const imagePathList: ImagePath[] = imagePathJson.map((imagePath: { alt: string, path: string }) => {
            return ImagePath.create({alt: imagePath.alt, path: imagePath.path});
        });

        let curiosTags:string[] = [];
        if (apiResponse.HashTagList !== "") {
            curiosTags = Array.from(
                new Set(
                    apiResponse.HashTagList
                        .split(',')
                        .map(tag => tag.trim()) // 空白を取り除く
                        .filter(tag => tag && tag !== '#') // 空文字や # のみを除外
                )
            );
        }

        const input: QuestDetailIF = {
            questId: apiResponse.QuestId,
            ownerUserUid: apiResponse.OwnerUserUid,
            ownerUserName: apiResponse.OwnerUserName,
            isPublished: apiResponse.IsPublished,
            updatedAt: apiResponse.UpdatedAt,
            title: apiResponse.Title,
            description: apiResponse.Description,
            benefit: apiResponse.Benefit,
            termsFrom: apiResponse.TermsFrom,
            termsTo: apiResponse.TermsTo,
            relationQuestIdList: apiResponse.RelationQuestIdList,
            hashTagStringList: curiosTags,
            imagePathList: imagePathList,
            mentionList: apiResponse.MentionList
        }

        return new QuestDetail(input);
    }

    /**
     * 初期化
     */
    static initQuestDetail(): QuestDetail {
        const input: QuestDetailIF = {
            questId: '',
            ownerUserUid: '',
            ownerUserName: '',
            isPublished: false,
            updatedAt: '',
            title: '',
            description: '',
            benefit: '',
            termsFrom: '',
            termsTo: '',
            relationQuestIdList: [],
            hashTagStringList: [],
            imagePathList: [],
            mentionList: []
        }

        return new QuestDetail(input);
    }

    // TODO:データベースのunixタイムが間違えてる？
    getTermsFromAsDysJS(): any {
        const timestamp = parseInt(this.termsFrom);
        if (isNaN(timestamp)) {
            console.error("Invalid timestamp");
            return null;
        }

        const int = timestamp * 1000;

        if (isNaN(timestamp)) {
            console.error("Invalid timestamp");
            return null;
        }

        console.log(dayjs(int));
        return dayjs(int);
    }

    // TODO:データベースのunixタイムが間違えてる？
    getTermsToAsDysJS(): any {
        const timestamp = parseInt(this.termsTo);
        if (isNaN(timestamp)) {
            console.error("Invalid timestamp");
            return null;
        }

        const int = timestamp * 1000;

        if (isNaN(timestamp)) {
            console.error("Invalid timestamp");
            return null;
        }

        console.log(dayjs(int));
        return dayjs(int);
    }
}