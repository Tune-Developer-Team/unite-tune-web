import ImagePath from "../data/ImagePath";
import CURIOS_DIRECTION, {CuriosDirectionType} from "../../consts/curiosDirection";
import axios, {AxiosResponse} from "axios";
import {endPoint} from "../../consts/api";

export interface ProfileIF {
    nickName: string
    iconImage: ImagePath
    description: string
    curios: string
    curiosValue: number
    curiosDirection: CuriosDirectionType
    isPublishedAis: boolean
    isShowMbti: boolean
    isShowPortfolio: boolean
    mbti: string
}

export interface ProfileApiResponseIF {
    NickName: string
    IconImage: string
    Description: string
    Curios: string
    CuriosValue: number
    CuriosDirection: number
    IsPublishedAis: boolean
    IsShowMbti: boolean
    IsShowPortfolio: boolean
    Mbti: string
}

export default class Profile {
    public nickName: string
    public iconImage: ImagePath
    public description: string
    public curios: string
    public curiosValue: number
    public curiosDirection: CuriosDirectionType
    public isPublishedAis: boolean
    public isShowMbti: boolean
    public isShowPortfolio: boolean
    public mbti: string

    private constructor(
        argument: ProfileIF
    ) {
        this.nickName = argument.nickName
        this.iconImage = argument.iconImage
        this.description = argument.description
        this.curios = argument.curios
        this.curiosValue = argument.curiosValue
        this.curiosDirection = argument.curiosDirection
        this.isPublishedAis = argument.isPublishedAis
        this.isShowMbti = argument.isShowMbti
        this.isShowPortfolio = argument.isShowPortfolio
        this.mbti = argument.mbti
    }

    public static initProfile(): Profile {
        const argument: ProfileIF = {
            nickName: '',
            iconImage: ImagePath.create({path: '', alt: ''}),
            description: "",
            curios: "",
            curiosValue: 0,
            curiosDirection: CURIOS_DIRECTION.find(item => item.kind === 0)!,
            isPublishedAis: false,
            isShowMbti: false,
            isShowPortfolio: false,
            mbti: ""
        }
        return new Profile(argument);
    }

    public setProfile(argument: ProfileIF): void {
        this.nickName = argument.nickName;
        this.iconImage = argument.iconImage;
        this.description = argument.description
        this.curios = argument.curios;
        this.curiosValue = argument.curiosValue;
        this.curiosDirection = argument.curiosDirection;
        this.isPublishedAis = argument.isPublishedAis;
        this.isShowMbti = argument.isShowMbti;
        this.isShowPortfolio = argument.isShowPortfolio;
        this.mbti = argument.mbti;
    }

    public async fetchModel(uid: string, accessToken: string): Promise<ProfileApiResponseIF> {
        const api = axios.create({
            headers: {
                'Authorization': accessToken,
            }
        });
        const uri = `${endPoint.PROFILE}/${uid}`;
        console.log("do API:",uri);
        const response = await api.get(uri);
        const apiResponse: ProfileApiResponseIF = response.data.data
        return apiResponse
    }

    public setFromAPIResponse(apiResponse: ProfileApiResponseIF): void {

        const curiosDirectionKind = apiResponse.CuriosDirection ?? 0

        const iconImage = JSON.parse(apiResponse.IconImage);

        this.nickName = apiResponse.NickName ?? "undefined user";
        this.description = apiResponse.Description ?? "";
        this.curios = apiResponse.Curios ?? "";
        this.curiosValue = apiResponse.CuriosValue ?? 0;
        this.curiosDirection = CURIOS_DIRECTION.find(item => item.kind === curiosDirectionKind)!;
        this.iconImage = ImagePath.create({
            path: iconImage?.path ?? "",
            alt: iconImage?.alt ?? ""
        });
        this.isPublishedAis = apiResponse.IsPublishedAis ?? false;
        this.isShowMbti = apiResponse.IsShowMbti ?? false;
        this.isShowPortfolio = apiResponse.IsShowPortfolio ?? false;
        this.mbti = apiResponse.Mbti ?? "";
    }
}