import ImagePath from "../data/ImagePath";
import Mention from "../data/Mention";
import {hashTagString} from "../data/types";

export interface SeedIF {
    seedInfo: SeedInfoIF
    seedMetaInfo: SeedMetaInfoIF
}

export interface SeedInfoIF {
    imagePathList: ImagePath[];
    termsFrom: string;
    termsTo: string;
    isPublished: boolean;
    description: string;
    relationSeedIdList: string[];
    title: string;
    mentionList: Mention[];
    benefit: string;
    hashTagList: hashTagString[];
}

export interface SeedMetaInfoIF {
    seedId: string
    ownerUserUid: string
    isPublished: boolean
    updatedAt: string
}

export interface SeedInputIF {
    ownerUserUid: string
    isPublished: boolean
    seedId: string
    title: string
    description: string
    benefit: string
    termsFrom: string
    termsTo: string
    relationSeedIdList: string[]
    hashTagStringList: hashTagString[]
    imagePathList: ImagePath[]
    mentionList: Mention[]
}

/**
 * Seedモデル
 */
export class Seed implements SeedIF {
    /**
     * コンストラクタ
     * @param seedInfo
     * @param seedMetaInfo
     */
    private constructor(
        readonly seedInfo: SeedInfoIF,
        readonly seedMetaInfo: SeedMetaInfoIF
    ) {
    }

    /**
     * ファクトリメソッド
     */
    static createSeedInstance(argument: SeedInputIF
    ): Seed {

        if (argument.hashTagStringList === null) {
            argument.hashTagStringList = [];
        }

        if (argument.imagePathList === null) {
            argument.imagePathList = [];
        }

        if (argument.mentionList === null) {
            argument.mentionList = [];
        }

        if (argument.title === '') {
            console.log('error')
        }

        if (argument.description === '') {
            console.log('error')
        }

        if (argument.benefit === '') {
            console.log('error')
        }

        const seedInfo: SeedInfoIF = {
            title: argument.title,
            description: argument.description,
            benefit: argument.benefit,
            isPublished: argument.isPublished,
            termsFrom: argument.termsFrom,
            termsTo: argument.termsTo,
            relationSeedIdList: argument.relationSeedIdList,
            hashTagList: argument.hashTagStringList,
            mentionList: argument.mentionList,
            imagePathList: argument.imagePathList,
        };

        const seedMetaInfo: SeedMetaInfoIF = {
            seedId: argument.seedId,
            isPublished: argument.isPublished,
            ownerUserUid: argument.ownerUserUid,
            updatedAt: ''
        }

        return new Seed(seedInfo, seedMetaInfo);
    }
}