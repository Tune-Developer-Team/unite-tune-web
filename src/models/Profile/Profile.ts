import ImagePath from "../data/ImagePath";

export interface ProfileIF {
    nickName: string
    iconImage: ImagePath
}

export interface ProfileApiResponseIF {
    NickName: string
    IconImage: ImagePath
}

export default class Profile {
    private constructor(
        public nickName: string,
        public iconImage: ImagePath,
    ) {
    }

    public static initProfile(): Profile {
        return new Profile('', ImagePath.create({path: '', alt: ''}));
    }

    public setProfile(argument: ProfileIF): void {
        this.nickName = argument.nickName;
        this.iconImage = argument.iconImage;
    }

    public createFromAPIResponse(apiResponse: ProfileApiResponseIF): Profile {
        const iconImage = ImagePath.create({path: apiResponse.IconImage?.path??"", alt: apiResponse.IconImage?.alt??""});



        return new Profile(apiResponse.NickName??"User", iconImage);
    }
}