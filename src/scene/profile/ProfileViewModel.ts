import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {ProfileViewModelIF} from "./ProfileViewModelIF";
import Profile, {ProfileApiResponseIF} from "../../models/Profile/Profile";
import axios from "axios";
import {endPoint} from "../../consts/api";

export class ProfileViewModel implements ProfileViewModelIF {
    public authState:Authentication = Authentication.initAuthentication();
    public profile: Profile = Profile.initProfile();

    /**
     * セットアップ処理
     * @param argument
     */
     setUp(argument: { authentication: AuthenticationArgumentIF, uId: string }): ProfileViewModel {
        this.authState.setAuthentication(argument.authentication);
        return this
    }

    /**
     * 取得
     */
    async fetchUserProfile(): Promise<void> {
        console.log("fetchUserProfile");
        const profileApiResponse = await this.profile.fetchModel(this.authState.getUid(), this.authState.accessToken);
        console.log(profileApiResponse.NickName);
        console.log(profileApiResponse.IconImage);
        this.profile.setFromAPIResponse(profileApiResponse);
        console.log(this.profile.nickName);
    }

    getProfile():Profile {
        return this.profile
    }

    async updateProfile(uId: string, newProfile: Profile): Promise<void> {
        const api = axios.create({
            headers: {
                'Authorization': this.authState.accessToken,
            }
        });

        const body = {
            nickName:newProfile.nickName,
            iconImage: JSON.stringify(newProfile.iconImage),
            description:newProfile.description,
            curios:newProfile.curios,
            curiosValue:newProfile.curiosValue,
            curiosDirection:newProfile.curiosDirection.kind,
            isPublishedAis:newProfile.isPublishedAis,
            isShowMbti:newProfile.isShowMbti,
            isShowPortfolio:newProfile.isShowPortfolio,
            mbti:newProfile.mbti
        }

        const response = await api.put(`${endPoint.PROFILE}/${uId}`, body);
        console.log(response.data.data);

        // プロフィールインスタンス更新
        this.profile.setFromAPIResponse(response.data.data);
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }
}