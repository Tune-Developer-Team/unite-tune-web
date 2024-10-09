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
     */
    public async fetchThinkList(props: { accessToken: string, uid: string }): Promise<ThinkTable> {
        // シンクを取得する
        const accessToken = props.accessToken as string;
        const axiosInstance = axios.create({
            headers: {
                'Authorization': accessToken
            }
        });

        try {
            const response = await axiosInstance.get(`${endPoint.THINK_TIMELINE}?chunk=20`);
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
            // const dateTime = new Date(thinkList[i].createdAt);
            // const createdAtString = format(dateTime, 'yyyy-MM-dd HH:mm:ss') as dateTimeString;
            const dateTime = new Date();
            const createdAtString = format(dateTime, 'yyyy-MM-dd HH:mm:ss') as dateTimeString;
            console.log(createdAtString);

            const iconPath = ImagePath.create({alt: '', path: thinkListItem.IconPath});

            const thinkArgument: ThinkIF = {
                sentence: thinkListItem.Sentence,
                thinkUserName: thinkListItem.NickName,
                iconPath: iconPath,
                ownerUserUid: thinkListItem.OwnerUserUid,
                // imagePathList: thinkListItem.ImagePathList,
                imagePathList: [ImagePath.create({alt: "", path: ""})],
                thinkId: thinkListItem.ThinkId,
                // hashTagList: thinkListItem.HashTagList,
                hashTagList: ['#tag1', '#tag2', '#tag3'],
                // mentionList: thinkListItem.MentionList,
                mentionList: [Mention.create({idValue: "", idCategory: ""})],
                createdAt: thinkListItem.CreatedAt,
                parentThinkId: thinkListItem.ParentThinkId,
                userIconImagePath: thinkListItem.UserIconImagePath,
                favoriteCount: thinkListItem.FavoriteCount,
                repostCount: thinkListItem.RepostCount
            }

            return Think.createThinkInstance(thinkArgument);
        });
    }

    public getThinkList(): Think[] {
        return this.thinkList;
    }
}

export interface ThinkApiResponseIF {
    ThinkId: string
    NickName: string
    IconPath: string
    OwnerUserUid: string
    UserIconImagePath: string
    FavoriteCount: number
    RepostCount: number
    CreatedAt: string
    ParentThinkId: string
    Sentence: string
    HashTagList: string
    MentionList: string
    ImagePathList: string
}