import axios, {AxiosResponse} from "axios";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {SignInViewModelIF} from "./SignInViewModelIF";
import {endPoint} from "../../consts/api";

export class SignInViewModel implements SignInViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
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
     * サインインを実行する
     */
    async signIn(code:string): Promise<AxiosResponse> {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

        const params = {
            code,
            clientId: clientId,
            authType: 'signin',
        }

        console.log(`params`);
        console.log(params);

        const axiosInstance = axios.create({
            headers: {
                'Authorization': 'sign-in-unite-web-app'
            }
        });

        return await axiosInstance.post(endPoint.SIGNIN, params);
    }
}