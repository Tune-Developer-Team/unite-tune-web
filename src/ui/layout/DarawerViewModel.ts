import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import dayjs from "dayjs";
import Profile from "../../models/Profile/Profile";
import {Api} from "../../models/Api/Api";
import {AxiosResponse} from "axios";
import {CustomUrl} from "../../models/CustomUrl/CustomUrl";

export class DrawerViewModel {
    public authState: Authentication = Authentication.initAuthentication();
    public profile: Profile = Profile.initProfile();
    public customUrlList: CustomUrl[] = [];
    constructor(
    ) {
        console.log('====================DrawerViewModel_called====================');
    }

    /**
     * セットアップ処理
     * @param argument
     */
    setUp(argument: { profile: { iconImage: any; nickName: any }; authentication: { uid: any; accessToken: any; email: any } }): void {
        console.log('====================DrawerViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);
        this.profile.setProfile(argument.profile);
        console.log('====================DrawerViewModel_setup_end====================');
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }

    /**
     *
     */
    generateSeedId(): string {
        // 新規作成の際のseedIdを生成 TODO: やっつけなのでちゃんと設計する
        const date = Date();
        const dateString = dayjs(date).format("YYYYMMDDhhmmss");
        console.log(this.authState);
        return this.authState.getUid() + dateString;
    }

    /**
     *
     */
    async addCustomUrl(param: { uid: string, urlString: string, textString: string }): Promise<AxiosResponse> {
        const endPoint = process.env.REACT_APP_ADD_CUSTOM_URL_API as string;
        const api = new Api(this.authState);
        return api.post({endPoint: endPoint, body: param});
    }

    /**
     *
     */
    async fetchCustomUrl(): Promise<AxiosResponse> {
        console.log("===========fetchCustomUrl============");
        const endPoint = process.env.REACT_APP_FETCH_CUSTOM_URL_API as string;
        const api = new Api(this.authState);
        return api.get(endPoint);
    }
}