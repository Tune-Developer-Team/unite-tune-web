import {endPoint} from "../../consts/api";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {SeedDetailViewModelIF} from "./seedDetailViewModelIF";
import {Api} from "../../models/Api/Api";

export class SeedDetailViewModel implements SeedDetailViewModelIF{
    protected authState: Authentication;
    public seedDetail: SeedDetail

    constructor() {
        this.authState = Authentication.initAuthentication();
        this.seedDetail = SeedDetail.initSeedDetail();
    }

    /**
     * セットアップ処理
     * @param argument
     */
    async setUp(argument: { authentication: AuthenticationArgumentIF, seedId: string }): Promise<void> {
        console.log('====================SeedDetailViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);

        //  詳細取得
        await this.fetchSeedDetail(argument.seedId);
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }

    /**
     * 取得
     */
    async fetchSeedDetail(seedId: string): Promise<void> {
        const api = new Api(this.authState);
        const response = await api.get(`${endPoint.SEED}/${seedId}`);
        this.seedDetail = this.seedDetail.createFromAPIResponse(response.data.data);
    }
}