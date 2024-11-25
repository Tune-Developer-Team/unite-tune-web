import axios, {AxiosResponse} from "axios";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {SignInViewModelIF} from "./SignInViewModelIF";
import {endPoint} from "../../consts/api";
import {AuthenticationStateIF} from "../../atoms/AuthenticationState";

export class SignInViewModel implements SignInViewModelIF {
    protected authState:Authentication;
    constructor(state: AuthenticationStateIF
    ) {
        this.authState = Authentication.fromState(state);
    }

    /**
     * セットアップ処理
     * @param argument
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void {
        this.authState.setAuthentication(argument.authentication);
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
            headers: {}
        });

        return await axiosInstance.post(endPoint.SIGNIN, params);
    }
}