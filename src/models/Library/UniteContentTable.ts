import axios, {AxiosResponse} from "axios";
import {dateTimeString, hashTagString} from "../data/types";
import Mention from "../data/Mention";
import ImagePath from "../data/ImagePath";
import {format} from "util";
import {endPoint} from "../../consts/api";
import {UniteContent, UniteContentIF} from "./UniteContent";

export interface UniteContentListItem {
    sentence: string
    uniteContentUserName: string
    uniteContentId: string
    hashTagList: hashTagString[];
    imagePathList: ImagePath[];
    mentionList: Mention[];
    createdAt: string
    parentUniteContentId: string
    userIconImagePath: string
    favoriteCount: number
    repostCount: number
}

export class UniteContentTable {
    constructor(public uniteContentList: UniteContent[]) {
    }

    public static initUniteContentTable(): UniteContentTable {
        return new UniteContentTable([]);
    }

    /**
     * UniteContentリストを取得する
     * @param props
     * @param search
     */
    public async fetchUniteContentList(props: { accessToken: string, uid: string }, search: FetchTimeLineSearchIF): Promise<UniteContentTable> {
        // シンクを取得する
        const accessToken = props.accessToken as string;
        const axiosInstance = axios.create({
            headers: {
                'Authorization': accessToken
            }
        });

        try {
            const response = await axiosInstance.get(`${endPoint.THINK_TIMELINE}?limit=${search.limit}&offset=${search.offset}&excludeReplies=${search.excludeReplies}&parentUniteContentId=${search.parentUniteContentId}`);
            console.log(response.data);
            const uniteContentList = this.createdUniteContentListByAPIResponse(response);
            return new UniteContentTable(uniteContentList);
        } catch (error) {
            console.log(error);
            return UniteContentTable.initUniteContentTable();
        }
    }


    private createdUniteContentListByAPIResponse(response: AxiosResponse): UniteContent[] {
        console.log("createdUniteContentListByAPIResponse")
        console.log(response.data.data)

        const apiResponse:UniteContentApiResponseIF[] = response.data.data

        return apiResponse.map((uniteContentListItem: UniteContentApiResponseIF) => {
            // オーナーユーザーのアイコン
            let ownerUserIconImagePath = ImagePath.create({path: "", alt: ""});
            if (uniteContentListItem.userIconImagePath !== "") {
                const ownerUserIconJson = JSON.parse(uniteContentListItem.userIconImagePath)
                ownerUserIconImagePath.alt = ownerUserIconJson.alt;
                ownerUserIconImagePath.path = ownerUserIconJson.path;
            }

            // キュリオスタグ
            console.log(uniteContentListItem.curiosTags)
            let curiosTags:string[] = [];
            if (uniteContentListItem.curiosTags !== "") {
                curiosTags = Array.from(
                    new Set(
                        uniteContentListItem.curiosTags
                            .split(',')
                            .map(tag => tag.trim()) // 空白を取り除く
                            .filter(tag => tag && tag !== '#') // 空文字や # のみを除外
                    )
                );
            }

            const uniteContentArgument: UniteContentIF = {
                sentence: uniteContentListItem.sentence,
                uniteContentUserName: uniteContentListItem.uniteContentUserName,
                userIconImagePath: ownerUserIconImagePath,
                ownerUserUid: uniteContentListItem.ownerUserUid,
                // imagePathList: uniteContentListItem.ImagePathList,
                imagePathList: [ImagePath.create({alt: "", path: ""})],
                uniteContentId: uniteContentListItem.uniteContentId,
                curiosTags: curiosTags,
                // mentionList: uniteContentListItem.MentionList,
                mentionList: [Mention.create({idValue: "", idCategory: ""})],
                createdAt: uniteContentListItem.createdAt,
                parentUniteContentId: uniteContentListItem.parentUniteContentId,
                favoriteCount: 0,
                repostCount: uniteContentListItem.reuniteContentCount,
                hasReply: uniteContentListItem.hasReply,
            }

            return UniteContent.createUniteContentInstance(uniteContentArgument);
        });
    }

    public getUniteContentList(): UniteContent[] {
        return this.uniteContentList;
    }
}

export interface FetchTimeLineSearchIF {
    limit: number
    offset: number
    excludeReplies: string
    parentUniteContentId: string
    ownerUserUid: string
}

export interface UniteContentApiResponseIF {
    uniteContentId: string
    uniteContentUserName: string
    ownerUserUid: string
    userIconImagePath: string
    createdAt: string
    sentence: string
    imagePathList: string
    curiosTags: string
    favoriteCount: number
    reuniteContentCount: number
    parentUniteContentId: string
    mentionList: string
    hasReply: boolean
}