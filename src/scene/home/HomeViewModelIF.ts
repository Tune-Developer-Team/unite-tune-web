import {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {hashTagString} from "../../models/data/types";
import ImagePath from "../../models/data/ImagePath";

export interface HomeViewModelIF {
    /**
     * データのフェッチやモデルのインスタンス化などを行う
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void

    /**
     * インスタンスの明示的な破棄や、状態の保存や確認を行う
     */
    cleanUp(): void
}

export interface SeedListItem {
    seedId: string
    title: string
    description: string
    ownerUserName: string
    hashTagStringList: hashTagString[];
    imagePath: ImagePath;
    updatedAt: string
    userIconImagePath: string
    favoriteCount: number
}

export interface SeedListApiResponseItemIF {
    ID: number
    SeedId: string
    Title: string
    OwnerUserUid: string
    Description: string
    IsPublished: boolean
    Benefit: string
    TermsFrom: number
    TermsTo: number
    HashTagList: string
    ImagePathList: string
    CreatedAt: string
    UpdatedAt: string
    DeletedAt: string
}

// export interface SeedListResponseItemIF {
//     id
//     seedId
//     title
//     ownerUserUid
//     description
//     isPublished
//     benefit
//     termsFrom
//     termsTo
//     hashTagList
//     imagePathList
//     createdAt
//     updatedAt
//     deletedAt
// }