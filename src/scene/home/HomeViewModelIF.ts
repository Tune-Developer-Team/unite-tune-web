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

// フロントエンドと揃えている
export interface SeedListItem {
    title: string
    description: string
    ownerUserName: string
    hashTagStringList: hashTagString[];
    imagePath: ImagePath;
    updatedAt: string
    userIconImagePath: string
    favoriteCount: number
}