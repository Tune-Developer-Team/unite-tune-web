import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {AddSeedInputParamIF, SeedEditViewModelIF} from "./SeedEditViewModelIF";
import {Api} from "../../models/Api/Api";
import {AxiosResponse} from "axios";
import {endPoint} from "../../consts/api";
import axios from "axios";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";

export class SeedEditViewModel implements SeedEditViewModelIF {
    public authState:Authentication;
    public seedDetail: SeedDetail;

    constructor() {
        this.authState = Authentication.initAuthentication();
        this.seedDetail = SeedDetail.initSeedDetail();
    }

    /**
     * セットアップ処理
     * @param argument
     */
    async setUp(argument: { authentication: AuthenticationArgumentIF, seedId: string}): Promise<void> {
        this.authState.setAuthentication(argument.authentication);
        //  詳細取得
        await this.fetchSeed(argument.seedId);
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
        const api = new Api(this.authState);
        return await api.post({endPoint:endPoint.SEED, body:seedInput})
    }

    /**
     * 下書きを新規作成・更新する
     */
    async addSeedAsDraft(seedInput: AddSeedInputParamIF): Promise<AxiosResponse> {
        const api = new Api(this.authState);
        return await api.post({endPoint: `${endPoint.SAVE_SEED_AS_DRAFT}/${seedInput.seedId}`, body:seedInput})
    }

    /**
     * 取得
     */
    async fetchSeed(seedId: string): Promise<void> {
        console.log("実行");
        const api = axios.create({
            headers: {
                'Authorization': 'allow',
            }
        });
        await api.get(`${endPoint.SEED}/${seedId}`).then((response)=>{
            this.seedDetail = this.seedDetail.createFromAPIResponse(response.data.data);
        }).catch((error)=>{
            // 空のエンティティ
            this.seedDetail = SeedDetail.initSeedDetail();
            console.log(error.error);
            console.log(error);
        });
    }
}