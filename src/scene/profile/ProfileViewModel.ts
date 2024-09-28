import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {ProfileViewModelIF} from "./ProfileViewModelIF";
import Profile from "../../models/Profile/Profile";
import axios from "axios";
import {endPoint} from "../../consts/api";

export class ProfileViewModel implements ProfileViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
    public profile: Profile = Profile.initProfile();

    /**
     * セットアップ処理
     * @param argument
     */
    async setUp(argument: { authentication: AuthenticationArgumentIF, uId: string }): Promise<ProfileViewModel> {
        this.authState.setAuthentication(argument.authentication);

        console.log(argument.uId)
        //  詳細取得
        await this.fetchUserProfile(argument.uId);
        return this
    }

    /**
     * 取得
     */
    async fetchUserProfile(uId: string): Promise<void> {
        const api = axios.create({
            headers: {
                'Authorization': this.authState.accessToken,
            }
        });
        const response = await api.get(`${endPoint.PROFILE}/${uId}`);
        console.log(response.data.data);
        this.profile = this.profile.createFromAPIResponse(response.data.data);
    }

    getProfile():Profile {
        return this.profile
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }
}