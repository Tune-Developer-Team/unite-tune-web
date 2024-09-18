import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {AddSeedInputParamIF, SeedEditViewModelIF} from "./SeedEditViewModelIF";
import {Api} from "../../models/Api/Api";
import axios, {AxiosResponse} from "axios";
import ImagePath from "../../models/data/ImagePath";
import {endPoint} from "../../consts/api";

export class SeedEditViewModel implements SeedEditViewModelIF {
    public authState:Authentication = Authentication.initAuthentication();
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
    async uploadFile(index: number, file: File): Promise<ImagePath[]> {
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
            console.log(path);
            const imagePath = ImagePath.create({alt: 'file1', path: path});
            this.imageFileList[index] = (imagePath);
            console.log(this.imageFileList);
        }).catch((err)=>{
            console.log("failure");
            console.log(err);
        });
        return this.imageFileList;
    }

    async removeFile(index: number): Promise<ImagePath[]> {
        console.log("remove",index);
        console.log(this.imageFileList[index]);
        // if(!this.imageFileList[index]){
        //     return this.imageFileList;
        // }
        // const api = new Api(this.authState);
        // await api.post({
        //     endPoint: endPoint.UPLOAD, body: {
        //         path: this.imageFileList[index].path,
        //     }
        // }).then((res) => {
        //     console.log("success");
        //     console.log(res);
        //
        //     this.imageFileList[0] = ImagePath.create({alt:'',path:''});
        //     console.log(this.imageFileList);
        // }).catch((err)=>{
        //     console.log("failure");
        //     console.log(err);
        // });
        this.imageFileList[index] = ImagePath.create({alt:'',path:''});
        console.log(this.imageFileList[index]);
        return this.imageFileList;
    }
}