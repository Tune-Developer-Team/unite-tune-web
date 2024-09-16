import axios, {Axios, AxiosResponse} from "axios";
import Authentication from "../Authentication/Authentication";

export class Api {
    public axiosInstance: Axios;

    constructor(authentication: Authentication) {
        console.log(authentication.accessToken);

        const accessToken = authentication.accessToken as string;

        if(!accessToken){
            throw new Error("accessToken is invalid");
        }

        this.axiosInstance = axios.create({
            headers: {
                'Authorization': authentication.accessToken,
            }
        });
    }

    /**
     * ポストメソッドでリクエストを投げる
     * @param props
     */
    public async post(props: { endPoint: string, body: any }): Promise<AxiosResponse> {
        console.log("===============post=============");
        console.log(props);

        const endPoint = props.endPoint;
        const body = props.body;

        if ((endPoint === '') || (endPoint === undefined)) {
            console.log("========Error===========")
            throw new Error("error")
        }

        return await this.axiosInstance.post(endPoint, body);
    }

    /**
     * ゲットメソッドでリクエストを投げる
     * @param endPoint
     */
    public async get(endPoint: string) {
        console.log("===============get=============");
        return await this.axiosInstance.get(endPoint);
    }

    /**
     * コンフィグを設定する
     * @param options
     */
    public setConfig(options: { contentsType: string }) {
        this.axiosInstance.interceptors.request.use(config => {
            config.headers['content-type'] = options.contentsType;
            return config;
        });
    }
}