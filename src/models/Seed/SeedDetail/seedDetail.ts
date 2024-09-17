/**
 * Seed詳細モデル
 */
import {SeedDetailApiResponseIF, SeedDetailIF} from "./seedDetailIF";
import ImagePath from "../../data/ImagePath";
import Mention from "../../data/Mention";
import {hashTagString} from "../../data/types";

export class SeedDetail {
    public seedId: string
    public ownerUserUid: string
    public ownerUserName: string
    public isPublished: boolean
    public updatedAt: string
    public title: string
    public description: string
    public benefit: string
    public termsFrom: string
    public termsTo: string
    public relationSeedIdList: string[]
    public hashTagStringList: hashTagString[]
    public imagePathList: ImagePath[]
    public mentionList: Mention[]

    /**
     * コンストラクタ
     * @param input
     */
    private constructor(input: SeedDetailIF) {
        this.seedId = input.seedId;
        this.ownerUserUid = input.ownerUserUid;
        this.ownerUserName = input.ownerUserName;
        this.isPublished = input.isPublished;
        this.updatedAt = input.updatedAt;
        this.title = input.title;
        this.description = input.description;
        this.benefit = input.benefit;
        this.termsFrom = input.termsFrom;
        this.termsTo = input.termsTo;
        this.relationSeedIdList = input.relationSeedIdList;
        this.hashTagStringList = input.hashTagStringList;
        this.imagePathList = input.imagePathList;
        this.mentionList = input.mentionList;
    }

    /**
     * 初期化
     */
    static initSeedDetail(): SeedDetail {
        const input: SeedDetailIF = {
            seedId: '',
            ownerUserUid: '',
            ownerUserName: '',
            isPublished: false,
            updatedAt: '',
            title: '',
            description: '',
            benefit: '',
            termsFrom: '',
            termsTo: '',
            relationSeedIdList: [],
            hashTagStringList: [],
            imagePathList: [],
            mentionList: []
        }

        return new SeedDetail(input);
    }

    /**
     * ファクトリメソッド
     */
    createFromAPIResponse(apiResponse: SeedDetailApiResponseIF
    ): SeedDetail {

        apiResponse.ImagePathList = [ImagePath.create({alt:'',path:''})];
        apiResponse.HashTagList = ['#tag1','#tag2','#tag3']; // TODO: JSONを配列に変換
        apiResponse.OwnerUserName = ''; // TODO: バックエンドが未実装

        const input: SeedDetailIF = {
            seedId: apiResponse.SeedId,
            ownerUserUid: apiResponse.OwnerUserUid,
            ownerUserName: apiResponse.OwnerUserName,
            isPublished: apiResponse.IsPublished,
            updatedAt: apiResponse.UpdatedAt,
            title: apiResponse.Title,
            description: apiResponse.Description,
            benefit: apiResponse.Benefit,
            termsFrom: apiResponse.TermsFrom,
            termsTo: apiResponse.TermsTo,
            relationSeedIdList: apiResponse.RelationSeedIdList,
            hashTagStringList: apiResponse.HashTagList,
            imagePathList: apiResponse.ImagePathList,
            mentionList: apiResponse.MentionList
        }

        return new SeedDetail(input);
    }
}