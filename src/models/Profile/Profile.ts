import ImagePath from "../data/ImagePath";

export interface ProfileIF {
    nickName: string
    iconImage: ImagePath
    description: string
    curios: string
    curiosValue: number
    curiosDirection: string
    isPublicAis: boolean
    isShowMbti: boolean
    isShowPortfolio: boolean
    mbti: string
}

export interface ProfileApiResponseIF {
    NickName: string
    IconImage: ImagePath
    Description: string
    Curios: string
    CuriosValue: number
    CuriosDirection: string
    IsPublicAis: boolean
    IsShowMbti: boolean
    IsShowPortfolio: boolean
    Mbti: string
}

// TODO: 実装
const description = "最近Goが好き.TypeScript, JavaScript, React, Flutter, Swift, Kotlin, PHP, Python, Go, Docker, AWS,heroku,GoogleCloudPlatform.人と喋るの好きなので、喋りましょう！"

export default class Profile {
    private constructor(
        public nickName: string,
        public iconImage: ImagePath,
        public description: string,
        public curios: string,
        public curiosValue: number,
        public curiosDirection: string,
        public isPublicAis: boolean,
        public isShowMbti: boolean,
        public isShowPortfolio: boolean,
        public mbti: string
    ) {
    }

    public static initProfile(): Profile {
        return new Profile(
            '',
            ImagePath.create({path: '', alt: ''}),
            "",
            "",
            0,
            "",
            false,
            false,
            false,
            ""
        );
    }

    public setProfile(argument: ProfileIF): void {
        this.nickName = argument.nickName;
        this.iconImage = argument.iconImage;
        this.description = argument.description
        this.curios = argument.curios;
        this.curiosValue = argument.curiosValue;
        this.curiosDirection = argument.curiosDirection;
        this.isPublicAis = argument.isPublicAis;
        this.isShowMbti = argument.isShowMbti;
        this.isShowPortfolio = argument.isShowPortfolio;
        this.mbti = argument.mbti;
    }

    public createFromAPIResponse(apiResponse: ProfileApiResponseIF): Profile {
        const iconImage = ImagePath.create({path: apiResponse.IconImage?.path??"", alt: apiResponse.IconImage?.alt??""});

        return new Profile(
            apiResponse.NickName??"User",
            iconImage,
            apiResponse.Description ?? description,
            apiResponse.Curios??"#Go, #React, #TypeScript, #怪談, #宇宙,#アニメ,#物理学,#猫",
            apiResponse.CuriosValue??80,
            apiResponse.CuriosDirection??"いのちだいじに",
            apiResponse.IsPublicAis??true,
            apiResponse.IsShowMbti??true,
            apiResponse.IsShowPortfolio??true,
            apiResponse.Mbti??"建築家(INTJ-A)",

        );
    }
}