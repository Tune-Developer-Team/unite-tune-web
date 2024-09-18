import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {AddSeedInputParamIF, SeedEditViewModelIF} from "./SeedEditViewModelIF";
import {Api} from "../../models/Api/Api";
import {AxiosResponse} from "axios";
import {endPoint} from "../../consts/api";

export class SeedEditViewModel implements SeedEditViewModelIF {
    public authState:Authentication = Authentication.initAuthentication();
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
        console.log('====================TimeLineViewModel_setup_end====================');
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }

    /**
     * シードを公開用として保存する
     */
    async addSeed(seedInput: AddSeedInputParamIF): Promise<AxiosResponse> {
        console.log("===============addSeed============");
        const api = new Api(this.authState);
        return await api.post({endPoint:endPoint.SEED, body:seedInput})
    }

    /**
     * 下書きを新規作成・更新する
     */
    async addSeedAsDraft(seedInput: AddSeedInputParamIF): Promise<AxiosResponse> {
        console.log("===============addSeed============");
        const api = new Api(this.authState);
        return await api.post({endPoint: `${endPoint.SAVE_SEED_AS_DRAFT}/${seedInput.seedId}`, body:seedInput})
    }
}