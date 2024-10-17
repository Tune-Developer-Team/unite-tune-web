import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {ProfileViewModelIF} from "./ProfileViewModelIF";
import Profile from "../../models/Profile/Profile";
import axios from "axios";
import {endPoint} from "../../consts/api";
import {TabItem} from "../../ui/layout/CustomTabs";

export class ProfileViewModel implements ProfileViewModelIF {
    public authState:Authentication = Authentication.initAuthentication();
    public profile: Profile = Profile.initProfile();
    public tabItems: TabItem[] = [{label: 'Main'}, {label: 'ThinkTank'}, {label: 'AIS'}, {label: 'Goods'}];

    /**
     * セットアップ処理
     * @param argument
     */
     setUp(argument: { authentication: AuthenticationArgumentIF, uid: string }): ProfileViewModel {
        this.authState.setAuthentication(argument.authentication);
        return this
    }

    /**
     * 取得
     */
    async fetchUserProfile(uid: string): Promise<void> {
        console.log("fetchUserProfile");
        const profileApiResponse = await this.profile.fetchModel(uid, this.authState.accessToken);
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
            description:newProfile.description,
            iconImage: newProfile.iconImage.path !== "" ? JSON.stringify(newProfile.iconImage) : null,
            curios:newProfile.curios,
            curiosValue:newProfile.curiosValue,
            curiosDirection:newProfile.curiosDirection.kind,
            isPublishedAis:newProfile.isPublishedAis,
            isShowMbti:newProfile.isShowMbti,
            isShowPortfolio:newProfile.isShowPortfolio,
            mbti:newProfile.mbti
        }

        // if (newProfile.iconImage.path !== "") {
            // body.iconImage = JSON.stringify(newProfile.iconImage);
        // }

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