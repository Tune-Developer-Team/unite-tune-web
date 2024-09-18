import {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {hashTagString} from "../../models/data/types";

export interface SeedEditViewModelIF {
    /**
     * データのフェッチやモデルのインスタンス化などを行う
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void

    /**
     * インスタンスの明示的な破棄や、状態の保存や確認を行う
     */
    cleanUp(): void
}

export interface AddSeedInputParamIF {
    imagePathList: string;
    termsFrom: number;
    termsTo: number;
    hashTagStringList: hashTagString[];
    isPublished: boolean;
    seedId: string;
    description: string;
    relationSeedIdList: string;
    title: string;
    mentionList: string;
    benefit: string;
    ownerUserUid: string
}