import axios, {AxiosResponse} from "axios";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {TuneCard} from "../../models/TuneCard/TuneCard";
import {endPoint} from "../../consts/api";

export interface SignUpInputIF {
    code: string,
    tuneCard: TuneCard,
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
        }

        const axiosInstance = axios.create({
            headers: {
                'Authorization': 'sign-in-unite-web-app',
            }
        });

       const registerResponse = await axiosInstance.post(endPoint.REGISTER, params);

        await this.registerSerialAndUid({
            uid: registerResponse.data.data.Uid,
            serial: argument.tuneCard.serial
        });

        return {
            userRegister: {
                uid: registerResponse.data.data.Uid,
                email: registerResponse.data.data.Email,
                accessToken: registerResponse.data.data.AccessToken,
                nickName: registerResponse.data.data.Email,
                iconImagePath: "profile/default/iconImage.png",
            }
        }
    }

    private async registerSerialAndUid(input: { serial: string, uid: string }): Promise<void> {
        if (input.uid !== "") {
            const cardTuneAPI = axios.create({
                headers: {
                    'Authorization': 'registerTuneCard',
                }
            });

            const params = {
                uid: input.uid,
                isActivated: true,
            }

            const cardTuneRegisterEndPoint = `${endPoint.TUNE_CARD}/${input.serial}`;
            await cardTuneAPI.put(cardTuneRegisterEndPoint, params).then(
                (cardTuneResponse: AxiosResponse<any>) => {
                    console.log(cardTuneResponse);
                }).catch((err) => {
                console.log(err);
            });
        }
    }
}