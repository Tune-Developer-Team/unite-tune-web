import axios, {AxiosResponse} from "axios";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {TuneCard} from "../../models/TuneCard/TuneCard";
import {endPoint} from "../../consts/api";

export interface SignUpInputIF {
    code: string,
    tuneCard: TuneCard
}

export class RegisterViewModel {
    protected authState:Authentication = Authentication.initAuthentication();

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
     * サインアップを実行する
     */
    async signUp(argument:SignUpInputIF): Promise<any> {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

        const params = {
            code: argument.code,
            clientId: clientId,
            uid: argument.tuneCard.uid,
            authType: "register"
        }

        console.log(`params`);
        console.log(params);

        const axiosInstance = axios.create({
            headers: {
                'Authorization': 'sign-in-unite-web-app',
                'x-api-key': '1yIDLcQTj28kU0fpfZFdCaZoi4dCoEgC8hLh1duf'
            }
        });

       const registerResponse = await axiosInstance.post(endPoint.REGISTER, params);

        const registerSerialAndUidResponse = await this.registerSerialAndUid({
            uid: argument.tuneCard.uid,
            serial: argument.tuneCard.serial
        })

        return {
            userRegister: registerResponse,
            cardRegister: registerSerialAndUidResponse
        }
    }

    private async registerSerialAndUid(input: { serial: string, uid: string }): Promise<void> {
        if (input.uid !== "") {
            const cardTuneAPI = axios.create({
                headers: {
                    'Authorization': 'registerTuneCard',
                    'x-api-key': '1yIDLcQTj28kU0fpfZFdCaZoi4dCoEgC8hLh1duf'
                }
            });
            const cardTuneRegisterEndPoint = process.env.REACT_APP_CARD_TUNE_REGISTER as string;
            await cardTuneAPI.post(cardTuneRegisterEndPoint, {
                serial: input.serial,
                uid: input.uid
            }).then((cardTuneResponse: AxiosResponse<any>) => {
                console.log(cardTuneResponse);
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}