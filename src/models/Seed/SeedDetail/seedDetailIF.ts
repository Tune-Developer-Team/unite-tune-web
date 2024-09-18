import {hashTagString} from "../../data/types";
import ImagePath from "../../data/ImagePath";
import Mention from "../../data/Mention";

export interface SeedDetailIF {
    seedId: string
    ownerUserUid: string
    ownerUserName: string
    isPublished: boolean
    updatedAt: string
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

export interface SeedDetailApiResponseIF {
    ID: number
    ImagePathList: string;
    TermsFrom: string;
    TermsTo: string;
    Description: string;
    RelationSeedIdList: string[];
    Title: string;
    MentionList: Mention[];
    Benefit: string;
    HashTagList: hashTagString[];
    SeedId: string
    OwnerUserUid: string
    OwnerUserName: string
    IsPublished: boolean
    UpdatedAt: string
}