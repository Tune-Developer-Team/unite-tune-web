import axios, {AxiosResponse} from "axios";
import {dateTimeString, hashTagString} from "../data/types";
import Mention from "../data/Mention";
import ImagePath from "../data/ImagePath";
import {Think, ThinkIF} from "./Think";
import {format} from "util";
import {endPoint} from "../../consts/api";

export interface ThinkListItem {
    sentence: string
    thinkUserName: string
    thinkId: string
    hashTagList: hashTagString[];
    imagePathList: ImagePath[];
    mentionList: Mention[];
    createdAt: string
    parentThinkId: string
    userIconImagePath: string
    favoriteCount: number
    repostCount: number
}

export class ThinkTable {
    constructor(public thinkList: Think[]) {
    }

    public static initThinkTable(): ThinkTable {
        return new ThinkTable([]);
    }

    /**
     * Thinkリストを取得する
     * @param props
     * @param search
     */
    public async fetchThinkList(props: { accessToken: string, uid: string }, search: FetchTimeLineSearchIF): Promise<ThinkTable> {
        // シンクを取得する
        const accessToken = props.accessToken as string;
        const axiosInstance = axios.create({
            headers: {
                'Authorization': accessToken
            }
        });

        try {
            const response = await axiosInstance.get(`${endPoint.THINK_TIMELINE}?limit=${search.limit}&offset=${search.offset}&excludeReplies=${search.excludeReplies}&parentThinkId=${search.parentThinkId}`);
            console.log(response.data);
            const thinkList = this.createdThinkListByAPIResponse(response);
            return new ThinkTable(thinkList);
        } catch (error) {
            console.log(error);
            return ThinkTable.initThinkTable();
        }
    }


    private createdThinkListByAPIResponse(response: AxiosResponse): Think[] {
        console.log("createdThinkListByAPIResponse")
        console.log(response.data.data)

        const apiResponse:ThinkApiResponseIF[] = response.data.data

        return apiResponse.map((thinkListItem: ThinkApiResponseIF) => {
            // オーナーユーザーのアイコン
            let ownerUserIconImagePath = ImagePath.create({path: "", alt: ""});
            if (thinkListItem.userIconImagePath !== "") {
                const ownerUserIconJson = JSON.parse(thinkListItem.userIconImagePath)
                ownerUserIconImagePath.alt = ownerUserIconJson.alt;
                ownerUserIconImagePath.path = ownerUserIconJson.path;
            }

            // キュリオスタグ
            console.log(thinkListItem.curiosTags)
            let curiosTags:string[] = [];
            if (thinkListItem.curiosTags !== "") {
                curiosTags = Array.from(
                    new Set(
                        thinkListItem.curiosTags
                            .split(',')
                            .map(tag => tag.trim()) // 空白を取り除く
                            .filter(tag => tag && tag !== '#') // 空文字や # のみを除外
                    )
                );
            }

            const thinkArgument: ThinkIF = {
                sentence: thinkListItem.sentence,
                thinkUserName: thinkListItem.thinkUserName,
                userIconImagePath: ownerUserIconImagePath,
                ownerUserUid: thinkListItem.ownerUserUid,
                // imagePathList: thinkListItem.ImagePathList,
                imagePathList: [ImagePath.create({alt: "", path: ""})],
                thinkId: thinkListItem.thinkId,
                curiosTags: curiosTags,
                // mentionList: thinkListItem.MentionList,
                mentionList: [Mention.create({idValue: "", idCategory: ""})],
                createdAt: thinkListItem.createdAt,
                parentThinkId: thinkListItem.parentThinkId,
                favoriteCount: 0,
                repostCount: thinkListItem.rethinkCount,
                hasReply: thinkListItem.hasReply,
            }

            return Think.createThinkInstance(thinkArgument);
        });
    }

    public getThinkList(): Think[] {
        return this.thinkList;
    }
}

export interface FetchTimeLineSearchIF {
    limit: number
    offset: number
    excludeReplies: string
    parentThinkId: string
    ownerUserUid: string
}

export interface ThinkApiResponseIF {
    thinkId: string
    thinkUserName: string
    ownerUserUid: string
    userIconImagePath: string
    createdAt: string
    sentence: string
    imagePathList: string
    curiosTags: string
    favoriteCount: number
    rethinkCount: number
    parentThinkId: string
    mentionList: string
    hasReply: boolean
}