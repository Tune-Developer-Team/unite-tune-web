import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {SeedEditViewModelIF} from "./SeedEditViewModelIF";
import {Api} from "../../models/Api/Api";
import {SeedInputIF} from "../../models/Seed/Seed";
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
    async addSeed(seedInput: SeedInputIF): Promise<AxiosResponse> {
        console.log("===============addSeed============");
        const api = new Api(this.authState);
        const endPoint = process.env.REACT_APP_ADD_SEED_API as string;
        const body = seedInput;
        return await api.post({endPoint, body})
    }

    /**
     * アップロード
     * @param body
     */
    async uploadS3(body: { file: File, fileName: string , seedId: string}): Promise<void> {
        const api = new Api(this.authState);
        const bucket = process.env.REACT_APP_SEED_BUCKET_NAME as string;

        const s3Response = await api.post({
            endPoint: endPoint.UPLOAD_IMAGE, body: {
                fileName: `draft/${body.seedId}/${body.fileName}`,
                bucket: bucket,
                acl: 'public-read'
            }
        });

        const url: string = s3Response.data.uploadUrl!;
        console.log(url);

        return await this.putFileToS3(url, body.file).then((res) => {
            console.log("success");
            console.log(res);

            const path = res.data.accessUrl;
            const imagePath = ImagePath.create({alt:body.fileName, path:path});
            this.imageFileList.push(imagePath);
        }).catch((err)=>{
            console.log("failure");
            console.log(err);
        });
    }

    /**
     * プットメソッドでリクエストを投げる
     * @param endPoint
     * @param file
     */
    private async putFileToS3(endPoint: string, file: File) {
        console.log("===============put=============");
        const fileData = new Blob([file], { type: 'image/png' });
        const axiosInstance = axios.create();
        return await axiosInstance.put(endPoint, fileData, {
            headers: {
                'Content-Type': file.type,
                'Content-Length': file.size,
            }
        });
    }
}