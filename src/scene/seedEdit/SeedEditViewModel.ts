import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {AddSeedInputParamIF, SeedEditViewModelIF} from "./SeedEditViewModelIF";
import {Api} from "../../models/Api/Api";
import axios, {AxiosResponse} from "axios";
import ImagePath from "../../models/data/ImagePath";
import {endPoint} from "../../consts/api";

export class SeedEditViewModel implements SeedEditViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
    public imageFileList: ImagePath[] = [];
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
     *
     */
    async addSeed(seedInput: AddSeedInputParamIF): Promise<AxiosResponse> {
        console.log("===============addSeed============");
        const api = new Api(this.authState);
        const body = seedInput;
        return await api.post({endPoint:endPoint.SEED, body})
    }

    /**
     * アップロード
     * @param body
     */
    async uploadFile(file: File): Promise<void> {
        const api = new Api(this.authState);

        api.setConfig({contentsType: "multipart/form-data"});
        await api.post({
            endPoint: endPoint.UPLOAD, body: {
                file: file,
            }
        }).then((res) => {
            console.log("success");
            console.log(res);

            const path = res.data.url;
            this.imageFileList.push(path);
            console.log(path);
        }).catch((err)=>{
            console.log("failure");
            console.log(err);
        });
    }
}