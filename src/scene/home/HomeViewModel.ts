import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {HomeViewModelIF, SeedListItem} from "./HomeViewModelIF";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";

export class HomeViewModel implements HomeViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
    public seedList: SeedListItem[] = [];
    constructor(
    ) {
        console.log('====================SignInViewModel_called====================');
    }

    /**
     * セットアップ処理
     * @param argument
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void {
        console.log('====================TimeLineViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);
        // this.fetchSeedList(this.authState).then((respones)=>{
        //     console.log(respones);
        // }).catch((error)=>{
        //     console.log(error);
        // });
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }

    /**
     * Seedを取得
     * @param authentication
     */
    async fetchSeedList(authentication: Authentication): Promise<{ message: string, seedList: SeedListItem[] }> {
        console.log("===fetchSeedList=====")
        console.log(authentication.accessToken)
        const api = new Api(authentication);
        const result = await api.get(endPoint.SEED);

        this.seedList = result.data.data;

        return {
            message: result.data.message,
            seedList: result.data.seedList
        };
    }
}