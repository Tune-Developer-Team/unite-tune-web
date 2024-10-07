import axios, {AxiosResponse} from "axios";
import {dateTimeString, hashTagString} from "../data/types";
import Mention from "../data/Mention";
import ImagePath from "../data/ImagePath";
import {Think, ThinkIF} from "./Think";
import {format} from "util";

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
    public async fetchThinkList(props: { accessToken: string, uid: string }): Promise<{ updateCount: number } | void> {
        // つふやきを取得する
        const endPoint = process.env.REACT_APP_FETCH_TSUBUYAKI as string;
        const accessToken = props.accessToken as string;
        const axiosInstance = axios.create({
            headers: {
                'Authorization': accessToken,
                'x-api-key': '1yIDLcQTj28kU0fpfZFdCaZoi4dCoEgC8hLh1duf'
            }
        });

        await axiosInstance.get(`${endPoint}?chunk=20`).then((response) => {
            console.log(response);
            const updateCount = response.data.thinkList.length;
            this.thinkList = this.createdThinkListByAPIResponse(response);

            console.log('==========================');
            console.log(this.thinkList);

            return {updateCount: updateCount};
        }).then((error) => {
            console.log(error);
        });
    }

    private createdThinkListByAPIResponse(response: AxiosResponse): Think[] {
        const thinkList: ThinkListItem[] = response.data.thinkList;

        return thinkList.map((thinkListItem: ThinkListItem, i: number) => {
            const dateTime = new Date(thinkList[i].createdAt);
            const createdAtString = format(dateTime, 'yyyy-MM-dd HH:mm:ss') as dateTimeString;
            console.log(createdAtString);

            const thinkArgument: ThinkIF = {
                sentence: thinkList[i].sentence,
                thinkUserName: thinkList[i].thinkUserName,
                imagePathList: thinkList[i].imagePathList,
                thinkId: thinkList[i].thinkId,
                hashTagList: thinkList[i].hashTagList,
                mentionList: thinkList[i].mentionList,
                createdAt: thinkList[i].createdAt,
                parentThinkId: thinkList[i].parentThinkId,
                userIconImagePath: thinkList[i].userIconImagePath,
                favoriteCount: thinkList[i].favoriteCount,
                repostCount: thinkList[i].repostCount
            }

            return Think.createThinkInstance(thinkArgument);
        });
    }

    public getThinkList(): Think[] {
        return this.thinkList;
    }
}